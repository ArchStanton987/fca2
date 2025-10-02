import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import { Roll } from "../combats.types"

export type SetDifficultyParams = {
  combatId: string
  roll: Partial<Roll>
}

export default function setDifficulty({ db }: UseCaseConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId, roll }: SetDifficultyParams) =>
    actionRepo.patchChild({ combatId, childKey: "roll" }, roll)
}
