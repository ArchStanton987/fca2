import { DbStatus } from "lib/character/status/status.types"

import { isKeyOf } from "utils/ts-utils"

import { Action, PlayerCombatData } from "../combats.types"
import { DEFAULT_INITIATIVE } from "../const/combat-const"

interface CombatEntry {
  rounds?: Record<string, Record<string, Action>>
}

export const getCurrentRoundId = (combat: CombatEntry | null) => {
  if (!combat) return 1
  const keys = Object.keys(combat.rounds ?? {}).map(Number)
  return keys.length > 0 ? Math.max(...keys) : 1
}

export const getCurrentActionId = (combat: CombatEntry | null) => {
  if (!combat) return 1
  const roundId = getCurrentRoundId(combat)
  const rounds = combat.rounds ?? {}
  const keys = Object.keys(rounds[roundId]).map(Number)
  return keys.length > 0 ? Math.max(...keys) : 1
}

export const getNextActorId = (
  contenders: Record<string, DbStatus & { initiative: number }>,
  idToExclude?: string
) => {
  // check if has rolled initiative
  const hasInit = Object.values(contenders).some(c => c.initiative === DEFAULT_INITIATIVE)
  if (!hasInit) throw new Error("All players must roll initiative")

  const contendersWithAp = Object.entries(contenders)
    .filter(([, status]) => status.combatStatus !== "inactive" && status.combatStatus !== "dead")
    .filter(([, status]) => status.currAp > 0)
    .filter(([id]) => id !== idToExclude)

  const activeContenders = contendersWithAp.filter(([, s]) => s.combatStatus === "active")
  const waitingContenders = contendersWithAp.filter(([, s]) => s.combatStatus === "wait")
  const chars = activeContenders.length > 0 ? activeContenders : waitingContenders

  if (chars.length === 0) throw new Error("No contenders with AP")

  const sortedChars = chars
    .sort(([, a], [, b]) => {
      if (a.currAp === b.currAp) return a.initiative - b.initiative
      return b.currAp - a.currAp
    })
    .map(([id]) => id)
  return sortedChars[0]
}

export const getIsFightOver = (
  players: Record<string, DbStatus>,
  enemies: Record<string, DbStatus>
) => {
  const playersInFight = Object.values(players).some(
    p => p.combatStatus === "active" || p.combatStatus === "wait"
  )
  const enemiesInFight = Object.values(enemies).some(
    e => e.combatStatus === "active" || e.combatStatus === "wait"
  )
  return !playersInFight || !enemiesInFight
}

export const getActivePlayersWithAp = (
  players: Record<string, DbStatus>,
  enemies: Record<string, DbStatus>
) =>
  Object.entries({ ...players, ...enemies })
    .filter(([, status]) => status.combatStatus === "active")
    .filter(([, status]) => status.currAp > 0)
    .map(([id, status]) => ({ id, status }))

export const getShouldCreateNewRound = (
  players: Record<string, DbStatus>,
  enemies: Record<string, DbStatus>,
  action: { actorId: string; apCost: number }
): boolean => {
  const charsWithAp = getActivePlayersWithAp(players, enemies)
  if (charsWithAp.length !== 1) return false
  if (charsWithAp[0].id !== action.actorId) return false
  const actorAp = charsWithAp[0].status.currAp
  const willSpendAllAp = actorAp - action.apCost <= 0
  return willSpendAllAp
}

export const getInitiativePrompts = (
  charId: string,
  players: Record<string, PlayerCombatData>,
  enemies: Record<string, PlayerCombatData>
) => {
  const contenders = { ...players, ...enemies }
  if (!isKeyOf(charId, contenders)) throw new Error("Character not found in combat")
  const playerShouldRollInitiative = contenders[charId].initiative === DEFAULT_INITIATIVE
  const shouldWaitOthers =
    Object.values(contenders).some(p => p.initiative === DEFAULT_INITIATIVE) &&
    !playerShouldRollInitiative

  return { playerShouldRollInitiative, shouldWaitOthers }
}
