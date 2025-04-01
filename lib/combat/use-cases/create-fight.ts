import { DbStatus } from "lib/character/status/status.types"
import repositoryMap from "lib/shared/db/get-repository"

type CombatStatus = {
  combatStatus?: DbStatus["combatStatus"]
  currentCombatId?: DbStatus["currentCombatId"]
}

export type CreateFightParams = {
  squadId: string
  id: string
  timestamp: string
  location?: string
  title: string
  description?: string
  players: Record<string, CombatStatus>
  enemies: Record<string, CombatStatus>
  isStartingNow: boolean
}

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const statusRepo = repositoryMap[dbType].statusRepository
  const squadRepo = repositoryMap[dbType].squadRepository

  return (params: CreateFightParams) => {
    const { isStartingNow, id, ...rest } = params
    const promises = []
    const players: Record<string, { initiative: number }> = {}
    const enemies: Record<string, { initiative: number }> = {}

    // update squad fight status
    if (isStartingNow) {
      promises.push(squadRepo.patch({ id: params.squadId }, { isInFight: true }))
    }

    // for each player, set combat status, current combat id
    Object.keys(params.players).forEach(charId => {
      players[charId] = { initiative: 1000 }
      if (isStartingNow) {
        const playerParams = { charId, charType: "characters" as const }
        const payload = { combatStatus: "active" as const, currentCombatId: id }
        promises.push(statusRepo.patch(playerParams, payload))
      }
    })
    // for each enemy, set combat status, current combat id
    Object.keys(params.enemies).forEach(charId => {
      enemies[charId] = { initiative: 1000 }
      if (isStartingNow) {
        const enemyParams = { charId, charType: "enemies" as const }
        const payload = { combatStatus: "active" as const, currentCombatId: id }
        promises.push(statusRepo.patch(enemyParams, payload))
      }
    })
    const payload = { ...rest, id, players, enemies, rounds: {} }
    promises.push(combatRepo.add({ id }, payload))

    return Promise.all(promises)
  }
}
