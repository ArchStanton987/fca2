import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"

export type ResetDifficultyParams = {
  combat: Combat
}

export default function resetDifficulty(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return ({ combat }: ResetDifficultyParams) => {
    const combatId = combat.id
    const roundId = getCurrentRoundId(combat)
    const id = getActionId(combat)

    return actionRepo.deleteChild({ combatId, roundId, id, childKey: "roll" })
  }
}
