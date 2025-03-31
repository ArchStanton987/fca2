import { DbStatus } from "lib/character/status/status.types"
import repositoryMap from "lib/shared/db/get-repository"

type CombatStatus = {
  combatStatus?: DbStatus["combatStatus"]
  currentCombatId?: DbStatus["currentCombatId"]
}

export type CreateFightParams = {
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

  return (params: CreateFightParams) => {
    const { isStartingNow, id, timestamp, location, title, description } = params
    const combatId = params.id
    const promises = []
    const players: Record<string, { initiative: number }> = {}
    const enemies: Record<string, { initiative: number }> = {}
    Object.keys(params.players).forEach(charId => {
      players[charId] = { initiative: 1000 }
      if (isStartingNow) {
        const p = { charId, charType: "characters" as const }
        promises.push(statusRepo.patch(p, { combatStatus: "active", currentCombatId: combatId }))
      }
    })
    Object.keys(params.enemies).forEach(charId => {
      enemies[charId] = { initiative: 1000 }
      if (isStartingNow) {
        const p = { charId, charType: "enemies" as const }
        promises.push(statusRepo.patch(p, { combatStatus: "active", currentCombatId: combatId }))
      }
    })
    const payload = { id, timestamp, location, title, description, players, enemies, rounds: {} }
    promises.push(combatRepo.add({ id: combatId }, payload))

    return Promise.all(promises)
  }
}
