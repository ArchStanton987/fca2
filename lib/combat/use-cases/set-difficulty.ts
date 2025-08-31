import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Roll } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"

export type SetDifficultyParams = {
  combat: Combat
  roll: Partial<Roll>
}

export default function setDifficulty(dbType: keyof typeof repositoryMap = "rtdb") {
  const rollRepo = repositoryMap[dbType].rollRepository

  return ({ combat, roll }: SetDifficultyParams) => {
    const combatId = combat.id
    const roundId = getCurrentRoundId(combat)
    const id = getActionId(combat)

    return rollRepo.patch({ combatId, roundId, id }, roll)
  }
}
