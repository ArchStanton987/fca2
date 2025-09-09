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
  const combatInfoRepo = repositoryMap[dbType].combatInfoRepository

  return async ({ isStartingNow, contenders, ...rest }: CreateFightParams) => {
    const payload = {
      ...rest,
      contenders: Object.fromEntries(Object.keys(contenders).map(c => [c, c]))
    }
    const creationRef = await combatInfoRepo.add({}, payload)
    const combatId = creationRef?.key
    if (!combatId) throw new Error("Failed to create combat")
    if (isStartingNow) {
      await startFight(dbType)({ combatId, contenders })
    }
    return combatId
  }
}
