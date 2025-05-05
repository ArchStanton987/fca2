// import { DbStatus } from "lib/character/status/status.types"
import { isKeyOf } from "utils/ts-utils"

import { Action, PlayerData } from "../combats.types"
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

export const getNextActorId = (contenders: Record<string, PlayerData>, idToExclude?: string) => {
  const needsRollInitiative = Object.values(contenders).some(
    c => c.combatData.initiative === DEFAULT_INITIATIVE
  )
  if (needsRollInitiative) throw new Error("All players must roll initiative")

  const contendersWithAp = Object.entries(contenders)
    .filter(
      ([, c]) => c.char.status.combatStatus !== "inactive" && c.char.status.combatStatus !== "dead"
    )
    .filter(([, c]) => c.char.status.currAp > 0)
    .filter(([id]) => id !== idToExclude)

  const activeContenders = contendersWithAp.filter(
    ([, s]) => s.char.status.combatStatus === "active"
  )
  const waitingContenders = contendersWithAp.filter(
    ([, s]) => s.char.status.combatStatus === "wait"
  )
  const chars = activeContenders.length > 0 ? activeContenders : waitingContenders

  if (chars.length === 0) throw new Error("No contenders with AP")

  const sortedChars = chars
    .sort(([, a], [, b]) => {
      if (a.char.status.currAp === b.char.status.currAp)
        return a.combatData.initiative - b.combatData.initiative
      return b.char.status.currAp - a.char.status.currAp
    })
    .map(([id]) => id)
  return sortedChars[0]
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

// export const getShouldCreateNewRound = (
//   players: Record<string, DbStatus>,
//   enemies: Record<string, DbStatus>,
//   action: { actorId: string; apCost: number }
// ): boolean => {
//   const charsWithAp = getActivePlayersWithAp(players, enemies)
//   if (charsWithAp.length !== 1) return false
//   if (charsWithAp[0].id !== action.actorId) return false
//   const actorAp = charsWithAp[0].status.currAp
//   const willSpendAllAp = actorAp - action.apCost <= 0
//   return willSpendAllAp
// }

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
