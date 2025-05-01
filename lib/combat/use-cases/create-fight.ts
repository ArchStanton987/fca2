import repositoryMap from "lib/shared/db/get-repository"

import { DEFAULT_INITIATIVE } from "../const/combat-const"
import startFight from "./start-fight"

export type CreateFightParams = {
  squadId: string
  timestamp: string
  location?: string
  title: string
  description?: string
  players: Record<string, { currMaxAp: number }>
  npcs: Record<string, { currMaxAp: number }>
  isStartingNow: boolean
}

const defaultContenderData = { initiative: DEFAULT_INITIATIVE, nextActionBonus: 0 }

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return async (params: CreateFightParams) => {
    const { isStartingNow, ...rest } = params
    const promises: Promise<void | void[]>[] = []

    const playersIds = Object.keys(rest.players)
    const players = Object.fromEntries(playersIds.map(pId => [pId, defaultContenderData]))
    const npcsIds = Object.keys(rest.npcs)
    const npcs = Object.fromEntries(npcsIds.map(eId => [eId, defaultContenderData]))
    const payload = { ...rest, players, npcs, currActorId: "", rounds: {} }
    const creationRef = await combatRepo.add({}, payload)
    const combatId = creationRef?.key
    if (!combatId) throw new Error("Failed to create combat")

    if (isStartingNow) {
      promises.push(startFight(dbType)({ combatId, players: params.players, npcs: params.npcs }))
    }

    return Promise.all(promises)
  }
}
