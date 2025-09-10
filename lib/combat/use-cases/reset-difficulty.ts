import repositoryMap from "lib/shared/db/get-repository"

export type ResetDifficultyParams = {
  combatId: string
}

export default function resetDifficulty(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return ({ combatId }: ResetDifficultyParams) =>
    actionRepo.deleteChild({ combatId, childKey: "roll" })
}
