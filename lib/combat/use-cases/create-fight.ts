import Playable from "lib/character/Playable"
import { UseCaseConfig } from "lib/get-use-cases"
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

export default function createFight(config: UseCaseConfig) {
  const { db } = config
  const squadRepo = repositoryMap[db].squadRepository
  const combatRepo = repositoryMap[db].combatRepository

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
      await startFight(config)({ combatId, contenders })
    }
    return combatId
  }
}
