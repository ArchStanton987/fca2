import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action } from "../combats.types"
import { getCurrentActionId, getCurrentRoundId } from "../utils/combat-utils"

export type UpdateActionParams = {
  payload: Partial<Action>
  combat: Combat
}

export default function updateAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return ({ combat, payload }: UpdateActionParams) => {
    const roundId = getCurrentRoundId(combat)
    const actionId = getCurrentActionId(combat)

    return actionRepo.patch({ combatId: combat.id, roundId, id: actionId }, payload)
  }
}
