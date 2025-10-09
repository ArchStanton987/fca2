import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { Roll } from "../combats.types"

export type SetDifficultyParams = {
  combatId: string
  roll: Partial<Roll>
}

export default function setDifficulty({ db }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId, roll }: SetDifficultyParams) =>
    actionRepo.patchChild({ combatId, childKey: "roll" }, roll)
}
