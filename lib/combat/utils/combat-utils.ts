import Abilities from "lib/character/abilities/Abilities"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { getKnowledgesBonus } from "lib/character/abilities/knowledges/knowledge-utils"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import skillsMap from "lib/character/abilities/skills/skills"
import { Skill, SkillId } from "lib/character/abilities/skills/skills.types"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { limbsMap } from "lib/character/health/Health"
import { LimbId } from "lib/character/health/health.const"
import CharInfo from "lib/character/info/CharInfo"
import { withDodgeSpecies } from "lib/character/playable.const"
import { Item } from "lib/inventory/use-sub-inv-cat"
import { BodyPart, ClothingData } from "lib/objects/data/clothings/clothings.types"
import Consumable from "lib/objects/data/consumables/Consumable"
import Weapon from "lib/objects/data/weapons/Weapon"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

import { isKeyOf } from "utils/ts-utils"

import Action from "../Action"
import Combat from "../Combat"
import { Roll } from "../combats.types"
import actions from "../const/actions"
import { DEFAULT_INITIATIVE, DODGE_AP_COST, PARRY_AP_COST } from "../const/combat-const"

export const getPlayingOrder = (combatStatuses: Record<string, CombatStatus>) => {
  // sort contenders by initiative and current ap, then combat status inactive, then dead
  const contenders = Object.entries(combatStatuses).map(([id, value]) => ({ id, ...value }))
  const sortedContenders = contenders
    .filter(c => c.combatStatus !== "inactive" && c.combatStatus !== "dead")
    .sort((a, b) => {
      if (a.currAp === b.currAp) return b.initiative - a.initiative
      return b.currAp - a.currAp
    })
  const inactiveContenders = Object.values(contenders).filter(c => c.combatStatus === "inactive")
  const deadContenders = Object.values(contenders).filter(c => c.combatStatus === "dead")
  return [...sortedContenders, ...inactiveContenders, ...deadContenders]
}

export const getDefaultPlayingId = (combatStatuses: Record<string, CombatStatus>) => {
  const contenders = getPlayingOrder(combatStatuses)
  const id =
    contenders.find(c => c.combatStatus === "active")?.id ??
    contenders.find(c => c.combatStatus === "wait")?.id
  return id
}

export const getActivePlayersWithAp = (contenders: Record<string, CombatStatus>) =>
  Object.entries(contenders)
    .filter(([, c]) => c.combatStatus === "active")
    .filter(([, c]) => c.currAp > 0)
    .map(([id, status]) => ({ id, status }))

export const getIsActionEndingRound = (
  contenders: Record<string, CombatStatus>,
  action: {
    apCost: number
    actorId: string
    reactionRoll?: Action["reactionRoll"]
  }
) => {
  const actor = contenders[action.actorId]
  if (!actor) return false
  const validContenders = Object.values(contenders)
    .filter(c => c.combatStatus !== "inactive")
    .filter(c => c.combatStatus !== "dead")
    .filter(c => c.currAp > 0)

  const actorHasRemainingAp = actor.currAp - action.apCost > 0

  if (validContenders.length === 1 && !actorHasRemainingAp) return true

  if (validContenders.length === 2 && action.reactionRoll) {
    const opponentId = action?.reactionRoll?.opponentId
    const opponentApCost = action?.reactionRoll?.opponentApCost

    if (opponentId && typeof opponentApCost === "number") {
      const opponent = contenders[opponentId]
      const opponentHasRemaningAp = opponent.currAp - opponentApCost > 0
      if (!opponentHasRemaningAp && !actorHasRemainingAp) return true
    }
  }
  return false
}

export const getInitiativePrompts = (charId: string, contenders: Record<string, CombatStatus>) => {
  if (!isKeyOf(charId, contenders)) {
    return { playerShouldRollInitiative: false, shouldWaitOthers: false }
  }
  const playerShouldRollInitiative = contenders[charId].initiative === DEFAULT_INITIATIVE
  const shouldWaitOthers =
    Object.values(contenders).some(p => p.initiative === DEFAULT_INITIATIVE) &&
    !playerShouldRollInitiative

  return { playerShouldRollInitiative, shouldWaitOthers }
}

interface ActionForm<T extends keyof typeof actions> {
  actionType: T | ""
  actionSubtype: keyof (typeof actions)[T]["subtypes"] | string
  item?: Consumable | Weapon
}

export const getSkillIdFromAction = <T extends keyof typeof actions>({
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

export const getActorSkillFromAction = <T extends keyof typeof actions>(
  { actionType, actionSubtype, item }: ActionForm<T>,
  abilities: Abilities
) => {
  if (actionType === "weapon" && item?.category === "weapons") {
    if (actionSubtype !== "hit" && actionSubtype !== "throw") {
      const { skillId } = item.data
      const sumAbilities = item.getSkillScore(abilities)
      return { skillId, skillLabel: skillsMap[skillId].short, sumAbilities }
    }
  }
  const skill = getSkillIdFromAction({ actionType, actionSubtype, item })
  if (!skill) throw new Error("No skill found")
  const knowledges = getKnowledgesFromAction({ actionType, actionSubtype, item })
  const knowledgeBonus = getKnowledgesBonus(knowledges, abilities.knowledges)
  const sumAbilities = abilities.skills.curr[skill.id] + knowledgeBonus
  return { skillId: skill.id, skillLabel: skill.label, sumAbilities }
}

// export const getItemWithSkillFromId = (itemDbKey: string | undefined, inventory: Inventory) => {
//   if (!itemDbKey) return undefined
//   let item
//   if (itemDbKey) {
//     if (inventory.weaponsRecord[itemDbKey]) item = inventory.weaponsRecord[itemDbKey]
//     if (inventory.consumablesRecord[itemDbKey]) item = inventory.consumablesRecord[itemDbKey]
//   }
//   return item
// }

const bodyPartMatch: Record<LimbId, BodyPart> = {
  head: "head",
  leftArm: "arms",
  rightArm: "arms",
  leftTorso: "torso",
  rightTorso: "torso",
  groin: "groin",
  leftLeg: "legs",
  rightLeg: "legs",
  body: "torso",
  tail: "torso"
}

const clothingDamageResistMatch: Record<Exclude<DamageTypeId, "other">, keyof ClothingData> = {
  physical: "physicalDamageResist",
  laser: "laserDamageResist",
  plasma: "plasmaDamageResist",
  fire: "fireDamageResist"
}

type DamageEntry = {
  rawDamage: number
  damageLocalization: LimbId
  damageType: DamageTypeId
}

export const getRealDamage = (
  targetEquipedClothings: Record<string, Item>,
  damage: DamageEntry
) => {
  const { rawDamage, damageLocalization, damageType } = damage
  let realDamage = rawDamage
  const relatedClothings = Object.values(targetEquipedClothings)
    .filter(c => c.category === "clothings")
    .filter(c => c.isEquipped && c.data.protects.includes(bodyPartMatch[damageLocalization]))

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
  return Math.round(realDamage)
}

// export const getItemFromId = (inv: Inventory, itemDbKey?: string) => {
//   if (!itemDbKey) return undefined
//   if (itemDbKey in inv.weaponsRecord) return inv.weaponsRecord[itemDbKey]
//   if (itemDbKey in inv.clothingsRecord) return inv.clothingsRecord[itemDbKey]
//   if (itemDbKey in inv.consumablesRecord) return inv.consumablesRecord[itemDbKey]
//   if (itemDbKey in inv.miscObjectsRecord) return inv.miscObjectsRecord[itemDbKey]
//   return undefined
// }

export const getBodyPart = (scoreStr: string): LimbId => {
  const score = parseInt(scoreStr, 10)
  if (Number.isNaN(score)) throw new Error("invalid score")
  // REWORKED MAP
  if (score === 69) return "groin"
  if (score <= 10) return "head"
  if (score <= 15) return "groin"
  if (score <= 26) return "leftLeg"
  if (score <= 37) return "rightLeg"
  if (score <= 48) return "leftArm"
  if (score <= 59) return "rightArm"
  if (score <= 80) return "leftTorso"
  if (score <= 100) return "rightTorso"
  throw new Error("invalid score")
}

export const getParrySkill = (weaponSkill: SkillId): SkillId => {
  if (weaponSkill === "unarmed") return "unarmed"
  return "melee"
}

export const getContenderAc = (
  roundId: number,
  abilities: Abilities,
  combatStatus: CombatStatus
) => {
  const currAc = abilities.secAttr.curr.armorClass ?? 0
  const bonusAc = combatStatus?.armorClassBonusRecord?.[roundId] ?? 0
  return currAc + bonusAc
}

export const getRollBonus = (
  combatStatus: CombatStatus,
  action?: { aimZone?: Action["aimZone"] }
) => {
  const actionBonus = combatStatus.actionBonus ?? 0
  const aimMalus = action?.aimZone ? limbsMap[action.aimZone].aim.aimMalus : 0
  return actionBonus - aimMalus
}

export const getRollFinalScore = (roll: Roll) => {
  const { sumAbilities, dice, difficulty, bonus, targetArmorClass } = roll
  return sumAbilities - dice + bonus - targetArmorClass - difficulty
}

export const getPlayerCanReact = (info: CharInfo, combatStatus: CombatStatus, action: Action) => {
  if (!action) return false

  if (!withDodgeSpecies.includes(info.speciesId)) return false

  const playerIsTarget = action.targetId === info.charId
  if (!playerIsTarget) return false

  const { currAp } = combatStatus
  const reactionActionsApCost = [DODGE_AP_COST, PARRY_AP_COST]
  const hasEnoughAp = reactionActionsApCost.some(cost => currAp >= cost)
  if (!hasEnoughAp) return false

  const isActive = combatStatus.combatStatus === "active" || combatStatus.combatStatus === "wait"
  if (!isActive) return false

  const { damageLocalization, reactionRoll } = action
  if (!!damageLocalization && reactionRoll === undefined) return true
  return false
}

export const getReactionAbilities = (
  abilities: Abilities,
  combatStatus: CombatStatus,
  equipedWeapons: Record<string, Weapon>,
  combat: Combat
) => {
  const { skills, knowledges, secAttr } = abilities
  const roundId = combat.currRoundId

  const armorClassBonus = combatStatus.armorClassBonusRecord?.[roundId] ?? 0

  const actionBonus = combatStatus.actionBonus ?? 0

  const dodgeKBonus = knowledgeLevels.find(el => el.id === knowledges.kDodge)?.bonus ?? 0

  const defaultWeapon = Object.values(equipedWeapons)[0] ?? Weapon.getUnarmed()
  const weaponSkillId = defaultWeapon.data.skillId
  const parryKBonus = knowledgeLevels.find(el => el.id === knowledges.kParry)?.bonus ?? 0
  const parrySkillId = getParrySkill(weaponSkillId)

  return {
    armorClass: {
      curr: secAttr.curr.armorClass,
      bonus: armorClassBonus,
      total: secAttr.curr.armorClass + armorClassBonus
    },
    dodge: {
      skillId: "physical" as const,
      curr: skills.curr.physical,
      knowledgeBonus: dodgeKBonus,
      bonus: actionBonus,
      total: skills.curr.physical + dodgeKBonus + actionBonus
    },
    parry: {
      skillId: parrySkillId,
      curr: skills.curr[parrySkillId],
      knowledgeBonus: parryKBonus,
      bonus: actionBonus,
      total: skills.curr[parrySkillId] + parryKBonus + actionBonus
    }
  }
}
