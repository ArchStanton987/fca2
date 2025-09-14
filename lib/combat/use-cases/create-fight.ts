import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import startFight from "./start-fight"

export type CreateFightParams = {
  gameId: string
  date: string
  location?: string
  title: string
  description?: string
  contenders: Record<string, Playable>
  isStartingNow: boolean
}

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const squadRepo = repositoryMap[dbType].squadRepository
  const combatRepo = repositoryMap[dbType].combatRepository

  return async ({ isStartingNow, contenders, ...rest }: CreateFightParams) => {
    const info = {
      ...rest,
      contenders: Object.fromEntries(Object.keys(contenders).map(c => [c, c]))
    }
    const payload = {
      info,
      history: {},
      state: { actorIdOverride: "", action: { actorId: "" } }
    }

    const creationRef = await combatRepo.add({}, payload)
    const combatId = creationRef?.key
    if (!combatId || typeof combatId !== "string") throw new Error("Failed to create combat")

    squadRepo.patchChild({ id: rest.gameId, childKey: "combats" }, { [combatId]: combatId })

    if (isStartingNow) {
      await startFight(dbType)({ combatId, contenders })
    }
    return combatId
  }
}
