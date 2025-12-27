import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type ResetDifficultyParams = {
  combatId: string
}

export default function resetReactionRoll({ db }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId }: ResetDifficultyParams) =>
    // @ts-ignore
    actionRepo.patchChild({ combatId, childKey: "reactionRoll" }, { opponentDice: null })
}
