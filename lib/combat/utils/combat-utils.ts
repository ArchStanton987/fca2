// import { DbStatus } from "lib/character/status/status.types"
import Playable from "lib/character/Playable"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { getKnowledgesBonus } from "lib/character/abilities/knowledges/knowledge-utils"
import skillsMap from "lib/character/abilities/skills/skills"
import { Skill, SkillId } from "lib/character/abilities/skills/skills.types"
import { BodyPart, LimbsHp } from "lib/character/health/health-types"
import { withDodgeSpecies } from "lib/character/meta/meta"
import Inventory from "lib/objects/Inventory"
import { ClothingData } from "lib/objects/data/clothings/clothings.types"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { DamageTypeId, Weapon } from "lib/objects/data/weapons/weapons.types"

import { isKeyOf } from "utils/ts-utils"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import actions from "../const/actions"
import { DEFAULT_INITIATIVE, DODGE_AP_COST, PARRY_AP_COST } from "../const/combat-const"

interface CombatEntry {
  rounds?: Record<string, Record<string, Action>>
}
type PlayerData = { char: Playable; combatData: PlayerCombatData }

export const getNewRoundId = (combat: Combat) => Object.keys(combat.rounds ?? {}).length + 1
export const getCurrentRoundId = (combat: CombatEntry | null) => {
  if (!combat) return 1
  const keys = Object.keys(combat.rounds ?? {}).map(Number)
  return keys.length > 0 ? Math.max(...keys) : 1
}
export const getActionId = (combat: Combat | null) => {
  if (!combat) return 1
  const roundId = getCurrentRoundId(combat)
  const rounds = combat.rounds ?? {}
  const roundActions = Object.entries(rounds[roundId] ?? {})
  if (roundActions.length === 0) return 1
  const action = roundActions.find(([, a]) => !a?.isDone)
  if (action) {
    const [actionId] = action
    return Number(actionId)
  }
  return roundActions.length + 1
}

export const getPlayingOrder = (contenders: Record<string, PlayerData>) => {
  // sort contenders by initiative and current ap, then combat status inactive, then dead
  const sortedContenders = Object.values(contenders)
    .filter(c => c.char.status.combatStatus !== "inactive" && c.char.status.combatStatus !== "dead")
    .sort((a, b) => {
      if (a.char.status.currAp === b.char.status.currAp)
        return b.combatData.initiative - a.combatData.initiative
      return b.char.status.currAp - a.char.status.currAp
    })
  const inactiveContenders = Object.values(contenders).filter(
    c => c.char.status.combatStatus === "inactive"
  )
  const deadContenders = Object.values(contenders).filter(
    c => c.char.status.combatStatus === "dead"
  )
  return [...sortedContenders, ...inactiveContenders, ...deadContenders]
}

export const getIsFightOver = (contenders: Record<string, PlayerData>) => {
  const enemies = Object.values(contenders).filter(p => p.char.meta.isEnemy)
  const withPlayers = Object.values(contenders).filter(p => !p.char.meta.isEnemy)
  const playersInFight = Object.values(withPlayers).some(
    p => p.char.status.combatStatus === "active" || p.char.status.combatStatus === "wait"
  )
  const enemiesInFight = Object.values(enemies).some(
    e => e.char.status.combatStatus === "active" || e.char.status.combatStatus === "wait"
  )
  return !playersInFight || !enemiesInFight
}

export const getActivePlayersWithAp = (contenders: Record<string, PlayerData>) =>
  Object.entries(contenders)
    .filter(([, c]) => c.char.status.combatStatus === "active")
    .filter(([, c]) => c.char.status.currAp > 0)
    .map(([id, status]) => ({ id, status }))

export const getIsActionEndingRound = (
  contenders: Record<string, PlayerData>,
  action: { apCost: number; actorId: string }
) => {
  const actor = contenders[action.actorId]
  if (!actor) return false
  const validContenders = Object.values(contenders)
    .filter(c => c.char.status.combatStatus !== "inactive")
    .filter(c => c.char.status.combatStatus !== "dead")
    .filter(c => c.char.status.currAp > 0)
  if (validContenders.length > 1) return false
  return actor.char.status.currAp - action.apCost <= 0
}

export const getInitiativePrompts = (
  charId: string,
  players: Record<string, PlayerData>,
  enemies: Record<string, PlayerData>
) => {
  const contenders = { ...players, ...enemies }
  if (!isKeyOf(charId, contenders)) {
    return { playerShouldRollInitiative: false, shouldWaitOthers: false }
  }
  const playerShouldRollInitiative = contenders[charId].combatData.initiative === DEFAULT_INITIATIVE
  const shouldWaitOthers =
    Object.values(contenders).some(p => p.combatData.initiative === DEFAULT_INITIATIVE) &&
    !playerShouldRollInitiative

  return { playerShouldRollInitiative, shouldWaitOthers }
}

interface ActionForm<T extends keyof typeof actions> {
  actionType: T | ""
  actionSubtype: keyof (typeof actions)[T]["subtypes"] | string
  item?: Consumable | Weapon
}

export const getSkillFromAction = <T extends keyof typeof actions>({
  actionType,
  actionSubtype,
  item
}: ActionForm<T>): Skill | null => {
  switch (actionType) {
    case "movement":
      return skillsMap.physical
    case "item":
      if (actionSubtype === "use" && item?.data?.skillId) return skillsMap[item.data.skillId]
      if (actionSubtype === "throw") return skillsMap.throw
      return null
    case "weapon":
      if (actionSubtype === "throw") return skillsMap.throw
      if (actionSubtype === "hit") return skillsMap.melee
      if (!item?.data?.skillId) throw new Error("No skill id found for given item")
      return skillsMap[item.data.skillId]
    default:
      return null
  }
}

// TODO: refactor, use in const as object factory
const getKnowledgesFromAction = <T extends keyof typeof actions>({
  actionType,
  actionSubtype,
  item
}: ActionForm<T>): KnowledgeId[] => {
  // MOVEMENT
  if (actionSubtype === "run" || actionSubtype === "sprint") return ["kRunning"]
  if (actionSubtype === "jump") return ["kStunt"]
  if (actionSubtype === "climb") return ["kClimbing"]

  // ITEMS
  if (actionType === "item" && actionSubtype === "use" && item) {
    return item.data.knowledges ?? []
  }

  // WEAPON
  if (actionType === "weapon" && actionSubtype === "hit") return ["kBluntWeapons"]
  if (actionType === "weapon" && item) return item.data.knowledges ?? []

  return []
}

export const getDiceRollData = <T extends keyof typeof actions>(
  { actionType, actionSubtype, item }: ActionForm<T>,
  char: Playable
): { skillId: SkillId; skillLabel: string; totalSkillScore: number } => {
  if (actionType === "weapon" && item) {
    if (actionSubtype !== "hit" && actionSubtype !== "throw") {
      if (!("skill" in item)) throw new Error("Item is not a weapon")
      const { skillId } = item.data
      return { skillId, skillLabel: skillsMap[skillId].short, totalSkillScore: item.skill }
    }
  }
  const skill = getSkillFromAction({ actionType, actionSubtype, item })
  if (!skill) throw new Error("No skill found")
  const knowledges = getKnowledgesFromAction({ actionType, actionSubtype, item })
  const knowledgeBonus = getKnowledgesBonus(knowledges, char)
  const totalSkillScore = char.skills.curr[skill.id] + knowledgeBonus
  return { skillId: skill.id, skillLabel: skill.label, totalSkillScore }
}

export const getItemWithSkillFromId = (itemDbKey: string | undefined, inventory: Inventory) => {
  if (!itemDbKey) return undefined
  let item
  if (itemDbKey) {
    if (inventory.weaponsRecord[itemDbKey]) item = inventory.weaponsRecord[itemDbKey]
    if (inventory.consumablesRecord[itemDbKey]) item = inventory.consumablesRecord[itemDbKey]
  }
  return item
}

const bodyPartMatch: Record<keyof LimbsHp, BodyPart> = {
  headHp: "head",
  leftArmHp: "arms",
  rightArmHp: "arms",
  leftTorsoHp: "torso",
  rightTorsoHp: "torso",
  groinHp: "groin",
  leftLegHp: "legs",
  rightLegHp: "legs"
}

const clothingDamageResistMatch: Record<Exclude<DamageTypeId, "other">, keyof ClothingData> = {
  physical: "physicalDamageResist",
  laser: "laserDamageResist",
  plasma: "plasmaDamageResist",
  fire: "fireDamageResist"
}

type DamageEntry = {
  rawDamage: number
  damageLocalization: keyof LimbsHp
  damageType: DamageTypeId
}

export const getRealDamage = (char: Playable, damage: DamageEntry) => {
  const { rawDamage, damageLocalization, damageType } = damage
  let realDamage = rawDamage
  const targetCharClothings = char.equipedObjects.clothings
  const relatedClothings = Object.values(targetCharClothings).filter(c =>
    c.data.protects.includes(bodyPartMatch[damageLocalization])
  )

  const threshold = relatedClothings.reduce((acc, curr) => acc + curr.data.threshold, 0)
  if (rawDamage < threshold) {
    realDamage = 0
  }
  relatedClothings.forEach(c => {
    if (damageType === "other") return
    const matchingResist = clothingDamageResistMatch[damageType]
    const v = c.data[matchingResist]
    if (typeof v !== "number") return
    const m = (100 - v) / 100
    realDamage *= m
  })
  return realDamage
}

export const getItemFromId = (inv: Inventory, itemDbKey?: string) => {
  if (!itemDbKey) return undefined
  if (itemDbKey in inv.weaponsRecord) return inv.weaponsRecord[itemDbKey]
  if (itemDbKey in inv.clothingsRecord) return inv.clothingsRecord[itemDbKey]
  if (itemDbKey in inv.consumablesRecord) return inv.consumablesRecord[itemDbKey]
  if (itemDbKey in inv.miscObjectsRecord) return inv.miscObjectsRecord[itemDbKey]
  return undefined
}

export const getBodyPart = (scoreStr: string): keyof LimbsHp => {
  const score = parseInt(scoreStr, 10)
  if (Number.isNaN(score)) throw new Error("invalid score")
  // REWORKED MAP
  if (score === 69) return "groinHp"
  if (score <= 10) return "headHp"
  if (score <= 15) return "groinHp"
  if (score <= 26) return "leftLegHp"
  if (score <= 37) return "rightLegHp"
  if (score <= 48) return "leftArmHp"
  if (score <= 59) return "rightArmHp"
  if (score <= 80) return "leftTorsoHp"
  if (score <= 100) return "rightTorsoHp"
  throw new Error("invalid score")
}

export const getParrySkill = (weaponSkill: SkillId): SkillId => {
  if (weaponSkill === "unarmed") return "unarmed"
  return "melee"
}

export const getActionScores = (combat: Combat | null, contenders: Record<string, PlayerData>) => {
  if (combat === null) return null
  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)
  const action = combat.rounds[roundId][actionId]
  if (!action) return null
  const { actorId, roll, targetId, oppositionRoll } = action
  const actor = contenders[actorId]
  if (!actor) return null
  if (!targetId) return null
  if (roll === undefined || roll === false) return null
  const { actorSkillScore, actorDiceScore, difficultyModifier } = roll
  if (!actorSkillScore || !actorDiceScore) return null
  const opponentBaseAc = contenders[targetId]?.char?.secAttr.curr.armorClass
  const opponentBonusAc = contenders?.[targetId]?.combatData?.acBonusRecord?.[roundId] ?? 0
  const opponentAc = opponentBaseAc + opponentBonusAc

  const actorActionBonus = actor.combatData?.actionBonus ?? 0
  const actorScore = actorSkillScore - actorDiceScore + actorActionBonus
  const actorFinalScore = actorScore - opponentAc - difficultyModifier
  const actorScores = {
    actorDiceScore,
    actorSkillScore,
    actorActionBonus,
    actorScore,
    difficultyModifier,
    opponentAc,
    actorFinalScore
  }
  if (!oppositionRoll) return { actorScores }
  const { opponentDiceScore, opponentId, opponentSkillScore } = oppositionRoll
  const opponent = contenders[opponentId]
  if (!opponent) throw new Error("opponent not found")
  const opponentActionBonus = opponent.combatData.actionBonus
  const opponentScore = opponentSkillScore - opponentDiceScore + opponentActionBonus
  const opponentReactionScore = opponentScore - actorFinalScore
  const actorReactionScore = actorFinalScore - opponentScore
  const opponentScores = {
    opponentDiceScore,
    opponentSkillScore,
    opponentActionBonus,
    opponentScore,
    opponentReactionScore
  }
  return { actorScores: { ...actorScores, actorReactionScore }, opponentScores }
}

export const getPlayerCanReact = (char: Playable, combat: Combat) => {
  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)
  const action = combat.rounds?.[roundId]?.[actionId]
  if (!action) return false

  if (!withDodgeSpecies.includes(char.meta.speciesId)) return false

  const playerIsTarget = action.targetId === char.charId
  if (!playerIsTarget) return false

  const { currAp } = char.status
  const reactionActionsApCost = [DODGE_AP_COST, PARRY_AP_COST]
  const hasEnoughAp = reactionActionsApCost.some(cost => currAp >= cost)
  if (!hasEnoughAp) return false

  const { damageLocalization, oppositionRoll } = action
  if (!!damageLocalization && oppositionRoll === undefined) return true
  return false
}
