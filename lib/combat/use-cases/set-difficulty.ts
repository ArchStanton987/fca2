import repositoryMap from "lib/shared/db/get-repository"

import { Roll } from "../combats.types"

export type SetDifficultyParams = {
  combatId: string
  roll: Partial<Roll>
}

export default function setDifficulty(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return ({ combatId, roll }: SetDifficultyParams) =>
    actionRepo.patchChild({ combatId, childKey: "roll" }, roll)
}
