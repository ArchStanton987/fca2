import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"

export type SaveActionParams = {
  combat: Combat
  action: Action
}

export default function saveAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository
  return async ({ action, combat }: SaveActionParams) => {
    // save action in combat
    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)
    const actionToSave = JSON.parse(JSON.stringify({ ...action, isDone: true })) // remove undefined values (throws error)
    return actionRepo.set({ combatId: combat.id, roundId, id: actionId }, actionToSave)
  }
}
