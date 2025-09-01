import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import startFight from "./start-fight"

export type CreateFightParams = {
  squadId: string
  date: string
  location?: string
  title: string
  description?: string
  contenders: Record<string, Playable>
  isStartingNow: boolean
}

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return async ({ contenders, isStartingNow, ...rest }: CreateFightParams) => {
    const players: Record<string, string> = {}
    const npcs: Record<string, string> = {}
    Object.entries(contenders).forEach(([id, contender]) => {
      const { isNpc } = contender.meta
      if (isNpc) {
        npcs[id] = id
      } else {
        players[id] = id
      }
    })
    const payload = { ...rest, currActorId: "", players, npcs, rounds: {} }
    const creationRef = await combatRepo.add({}, payload)
    const combatId = creationRef?.key
    if (!combatId) throw new Error("Failed to create combat")
    if (isStartingNow) {
      await startFight(dbType)({ combatId, contenders })
    }
    return combatId
  }
}
