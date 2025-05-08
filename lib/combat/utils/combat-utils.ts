// import { DbStatus } from "lib/character/status/status.types"
import Playable from "lib/character/Playable"

import { isKeyOf } from "utils/ts-utils"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import { DEFAULT_INITIATIVE } from "../const/combat-const"

interface CombatEntry {
  rounds?: Record<string, Record<string, Action>>
}
type PlayerData = { char: Playable; combatData: PlayerCombatData }

const getIsDefaultAction = (action: Action) =>
  action.actionType === "" &&
  action.actionSubtype === "" &&
  action.actorId === "" &&
  action.apCost === 0 &&
  action.itemId === "" &&
  action.targetName === ""

export const getNewRoundId = (combat: Combat) => Object.keys(combat.rounds ?? {}).length + 1
export const getCurrentRoundId = (combat: CombatEntry | null) => {
  if (!combat) return 1
  const keys = Object.keys(combat.rounds ?? {}).map(Number)
  return keys.length > 0 ? Math.max(...keys) : 1
}
export const getNewActionId = (combat: Combat) => {
  const roundId = getCurrentRoundId(combat)
  const rounds = combat.rounds ?? {}
  const actions = Object.values(rounds[roundId] ?? {})
  if (actions.length === 0) return 1
  const isDefaultAction = getIsDefaultAction(actions[0])
  if (isDefaultAction) return 1
  const keys = Object.keys(rounds[roundId] ?? {}).map(Number)
  return keys.length > 0 ? Math.max(...keys) + 1 : 1
}

export const getPlayingOrder = (contenders: Record<string, PlayerData>) => {
  // sort contenders by initiative and current ap, then combat status inactive, then dead
  const sortedContenders = Object.values(contenders)
    .filter(c => c.char.status.combatStatus !== "inactive" && c.char.status.combatStatus !== "dead")
    .sort((a, b) => {
      if (a.char.status.currAp === b.char.status.currAp)
        return a.combatData.initiative - b.combatData.initiative
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
