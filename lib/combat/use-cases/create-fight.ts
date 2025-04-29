import repositoryMap from "lib/shared/db/get-repository"

import { DEFAULT_INITIATIVE } from "../const/combat-const"

export type CreateFightParams = {
  squadId: string
  id: string
  timestamp: string
  location?: string
  title: string
  description?: string
  players: Record<string, { currMaxAp: number }>
  enemies: Record<string, { currMaxAp: number }>
  isStartingNow: boolean
}

const defaultContenderData = { initiative: DEFAULT_INITIATIVE, nextActionBonus: 0 }

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const statusRepo = repositoryMap[dbType].statusRepository
  const squadRepo = repositoryMap[dbType].squadRepository

  return (params: CreateFightParams) => {
    const { isStartingNow, id, ...rest } = params
    const promises = []

    const playersIds = Object.keys(rest.players)
    const players = Object.fromEntries(playersIds.map(pId => [pId, defaultContenderData]))
    const enemiesIds = Object.keys(rest.enemies)
    const enemies = Object.fromEntries(enemiesIds.map(eId => [eId, defaultContenderData]))
    const payload = { ...rest, id, players, enemies, currActorId: "", rounds: {} }
    promises.push(combatRepo.add({ id }, payload))
    const squadEnemies = Object.fromEntries(enemiesIds.map(eId => [eId, eId]))
    promises.push(squadRepo.patchChild({ id: params.squadId, childKey: "npc" }, squadEnemies))

    if (isStartingNow) {
      Object.entries({ players: params.players, enemies: params.enemies }).forEach(
        ([type, contenders]) => {
          Object.entries(contenders).forEach(([charId, { currMaxAp }]) => {
            const charType = type === "players" ? ("characters" as const) : ("npcs" as const)
            const s = { combatStatus: "active" as const, currentCombatId: id, currAp: currMaxAp }
            promises.push(statusRepo.patch({ charId, charType }, s))
          })
        }
      )
    }

    return Promise.all(promises)
  }
}
