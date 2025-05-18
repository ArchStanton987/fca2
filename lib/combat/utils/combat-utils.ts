// import { DbStatus } from "lib/character/status/status.types"
import Playable from "lib/character/Playable"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { getKnowledgesBonus } from "lib/character/abilities/knowledges/knowledge-utils"
import skillsMap from "lib/character/abilities/skills/skills"
import { Skill, SkillId } from "lib/character/abilities/skills/skills.types"
import Inventory from "lib/objects/Inventory"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import { isKeyOf } from "utils/ts-utils"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import actions from "../const/actions"
import { DEFAULT_INITIATIVE } from "../const/combat-const"

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
  actionSubType?: keyof (typeof actions)[T]["subtypes"] | ""
  item?: Consumable | Weapon
}

export const getSkillFromAction = <T extends keyof typeof actions>({
  actionType,
  actionSubType,
  item
}: ActionForm<T>): Skill | null => {
  switch (actionType) {
    case "movement":
      return skillsMap.physical
    case "item":
      if (actionSubType === "use" && item?.data?.skillId) return skillsMap[item.data.skillId]
      if (actionSubType === "throw") return skillsMap.throw
      return null
    case "weapon":
      if (actionSubType === "throw") return skillsMap.throw
      if (actionSubType === "hit") return skillsMap.melee
      if (!item?.data?.skillId) throw new Error("No skill id found for given item")
      return skillsMap[item.data.skillId]
    default:
      return null
  }
}

// TODO: refactor, use in const as object factory
const getKnowledgesFromAction = <T extends keyof typeof actions>({
  actionType,
  actionSubType,
  item
}: ActionForm<T>): KnowledgeId[] => {
  // MOVEMENT
  if (actionSubType === "run" || actionSubType === "sprint") return ["kRunning"]
  if (actionSubType === "jump") return ["kStunt"]
  if (actionSubType === "climb") return ["kClimbing"]

  // ITEMS
  if (actionType === "item" && actionSubType === "use" && item) {
    return item.data.knowledges ?? []
  }

  // WEAPON
  if (actionType === "weapon" && actionSubType === "hit") return ["kBluntWeapons"]
  if (actionType === "weapon" && item) return item.data.knowledges ?? []

  return []
}

export const getDiceRollData = <T extends keyof typeof actions>(
  { actionType, actionSubType, item }: ActionForm<T>,
  char: Playable
): { skillId: SkillId; skillLabel: string; totalSkillScore: number } => {
  if (actionType === "weapon" && item) {
    if (actionSubType !== "hit" && actionSubType !== "throw") {
      if (!("skill" in item)) throw new Error("Item is not a weapon")
      const { skillId } = item.data
      return { skillId, skillLabel: skillsMap[skillId].label, totalSkillScore: item.skill }
    }
  }
  const skill = getSkillFromAction({ actionType, actionSubType, item })
  if (!skill) throw new Error("No skill found")
  const knowledges = getKnowledgesFromAction({ actionType, actionSubType, item })
  const knowledgeBonus = getKnowledgesBonus(knowledges, char)
  const totalSkillScore = char.skills.curr[skill.id] + knowledgeBonus
  return { skillId: skill.id, skillLabel: skill.label, totalSkillScore }
}

export const getItemWithSkillFromId = (itemId: string | undefined, inventory: Inventory) => {
  if (!itemId) return undefined
  let item
  if (itemId) {
    if (inventory.weaponsRecord[itemId]) item = inventory.weaponsRecord[itemId]
    if (inventory.consumablesRecord[itemId]) item = inventory.consumablesRecord[itemId]
  }
  return item
}
