import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

export type ResetDifficultyParams = {
  combatId: string
}

export default function resetDifficulty({ db }: UseCaseConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId }: ResetDifficultyParams) =>
    actionRepo.deleteChild({ combatId, childKey: "roll" })
}
