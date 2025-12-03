import Abilities from "lib/character/abilities/Abilities"
import { useAbilities } from "lib/character/abilities/abilities-provider"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { getKnowledgesBonus } from "lib/character/abilities/knowledges/knowledge-utils"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import skillsMap from "lib/character/abilities/skills/skills"
import { Skill, SkillId } from "lib/character/abilities/skills/skills.types"
import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { limbsMap } from "lib/character/health/Health"
import { LimbId } from "lib/character/health/health.const"
import { TemplateId } from "lib/character/info/CharInfo"
import { useCharInfo } from "lib/character/info/info-provider"
import { withDodgeSpecies } from "lib/character/playable.const"
import { Item } from "lib/inventory/item.mappers"
import { useCombatWeapons } from "lib/inventory/use-sub-inv-cat"
import { BodyPart } from "lib/objects/data/clothings/armor.types"
import { ClothingData } from "lib/objects/data/clothings/clothings.types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

import { isKeyOf } from "utils/ts-utils"

import Action from "../Action"
import { Roll } from "../combats.types"
import actions from "../const/actions"
import { DEFAULT_INITIATIVE, DODGE_AP_COST, PARRY_AP_COST } from "../const/combat-const"
import { useCombat, useCombatState } from "../use-cases/sub-combats"

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
  item?: Item
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
      if (item?.category !== "consumables") throw new Error("Item is not a consumable")
      if (actionSubtype === "use" && item?.data?.skillId) return skillsMap[item.data.skillId]
      if (actionSubtype === "throw") return skillsMap.throw
      return null
    case "weapon":
      if (item?.category !== "weapons") throw new Error("Item is not a weapon")
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
    if (item.category !== "consumables") throw new Error("Item is not a consumable")
    return item.data.knowledges ?? []
  }

  // WEAPON
  if (actionType === "weapon" && actionSubtype === "hit") return ["kBluntWeapons"]
  if (actionType === "weapon" && item) {
    if (item.category !== "weapons") throw new Error("Item is not a weapon")
    return item.data.knowledges ?? []
  }

  return []
}

export const getActorSkillFromAction = <T extends keyof typeof actions>(
  { actionType, actionSubtype, item }: ActionForm<T>,
  abilities: Abilities,
  charInfo: { templateId: TemplateId; isCritter: boolean }
) => {
  if (actionType === "weapon" && item?.category === "weapons") {
    if (actionSubtype !== "hit" && actionSubtype !== "throw") {
      const { skillId } = item.data
      const sumAbilities = item.getSkillScore(abilities, charInfo)
      return { skillId, skillLabel: skillsMap[skillId].short, sumAbilities }
    }
  }
  const skill = getSkillFromAction({ actionType, actionSubtype, item })
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
export const useContenderAc = (charId: string) => {
  const { data: combatId } = useCombatId(charId)
  const { data: currAc } = useAbilities(charId, a => a.secAttr.curr.armorClass)
  const { data: roundId } = useCombat(combatId, c => c.currRoundId)
  const { data: bonusAc } = useCombatStatus(charId, s => s.armorClassBonusRecord?.[roundId] ?? 0)
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

export const useGetPlayerCanReact = (charId: string) => {
  const { data: canDodge } = useCharInfo(charId, i => withDodgeSpecies.includes(i.speciesId))
  const { data: combatStatus } = useCombatStatus(charId, s => ({
    combatId: s.combatId,
    hasEnoughAp: [DODGE_AP_COST, PARRY_AP_COST].some(cost => s.currAp >= cost),
    isActive: s.combatStatus === "active" || s.combatStatus === "wait"
  }))
  const { data: combatState } = useCombatState(combatStatus.combatId, state => ({
    isTarget: state.action.targetId === charId,
    isAwaitingReaction: !!state.action.damageLocalization && state.action.reactionRoll === undefined
  }))
  if (!canDodge) return false
  if (!combatState.isTarget || !combatState.isAwaitingReaction) return false
  if (!combatStatus.isActive || !combatStatus.hasEnoughAp) return false
  return true
}

export const useGetReactionAbilities = (charId: string) => {
  const weapons = useCombatWeapons(charId)
  const { data: combatId } = useCombatId(charId)
  const { data: roundId } = useCombat(combatId, c => c.currRoundId)
  const { data: status } = useCombatStatus(charId, s => ({
    actionBonus: s.actionBonus ?? 0,
    armorClassBonus: s.armorClassBonusRecord?.[roundId] ?? 0
  }))
  const { data: abilities } = useAbilities(charId, a => ({
    skills: a.skills,
    knowledges: a.knowledges,
    secAttr: a.secAttr
  }))

  const { skills, knowledges, secAttr } = abilities

  const dodgeKBonus = knowledgeLevels.find(el => el.id === knowledges.kDodge)?.bonus ?? 0

  const defaultWeapon = weapons[0]
  const weaponSkillId = defaultWeapon.data.skillId
  const parryKBonus = knowledgeLevels.find(el => el.id === knowledges.kParry)?.bonus ?? 0
  const parrySkillId = getParrySkill(weaponSkillId)

  return {
    armorClass: {
      curr: secAttr.curr.armorClass,
      bonus: status.armorClassBonus,
      total: secAttr.curr.armorClass + status.armorClassBonus
    },
    dodge: {
      skillId: "physical" as const,
      curr: skills.curr.physical,
      knowledgeBonus: dodgeKBonus,
      bonus: status.actionBonus,
      total: skills.curr.physical + dodgeKBonus + status.actionBonus
    },
    parry: {
      skillId: parrySkillId,
      curr: skills.curr[parrySkillId],
      knowledgeBonus: parryKBonus,
      bonus: status.actionBonus,
      total: skills.curr[parrySkillId] + parryKBonus + status.actionBonus
    }
  }
}
