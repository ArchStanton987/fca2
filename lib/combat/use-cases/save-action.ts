import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"
import updateContender from "./update-contender"

export type SaveActionParams = {
  action: Action
  contenders: Record<string, { char: Playable }>
  combat: Combat
}

export default function saveAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return async ({ action, combat, contenders }: SaveActionParams) => {
    const promises = []

    const { actorId } = action
    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)

    // if has rolled dices, reset action bonus
    if (action.roll !== false && typeof action?.roll?.actorDiceScore === "number") {
      const { char } = contenders[actorId]
      promises.push(updateContender(dbType)({ char, combat, payload: { actionBonus: 0 } }))
    }

    // save action in combat
    const actionToSave = JSON.parse(JSON.stringify({ ...action, isDone: true })) // remove undefined values (throws error)
    return actionRepo.set({ combatId: combat.id, roundId, id: actionId }, actionToSave)
  }
}
