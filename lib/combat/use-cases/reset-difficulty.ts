import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type ResetDifficultyParams = {
  combatId: string
}

export default function resetDifficulty({ db }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId }: ResetDifficultyParams) =>
    actionRepo.deleteChild({ combatId, childKey: "roll" })
}
