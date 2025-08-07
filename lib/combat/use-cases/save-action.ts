import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DbAction } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"
import updateContender from "./update-contender"

export type SaveActionParams = {
  action: DbAction & { actorId: string }
  contenders: Record<string, { char: Playable }>
  combat: Combat
}

export default function saveAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository
  const combatRepo = repositoryMap[dbType].combatRepository

  return async ({ action, combat, contenders }: SaveActionParams) => {
    const promises = []

    const { actorId, isCombinedAction } = action
    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)

    // if is part of a combined action, set current actor id in combat, else reset it
    if (isCombinedAction) {
      promises.push(combatRepo.patch({ id: combat.id }, { currActorId: actorId }))
    } else {
      promises.push(combatRepo.deleteChild({ id: combat.id, childKey: "currActorId" }))
    }

    // if has rolled dices, reset action bonus
    if (action.roll !== false && typeof action?.roll?.actorDiceScore === "number") {
      const { char } = contenders[actorId]
      promises.push(updateContender(dbType)({ char, combat, payload: { actionBonus: 0 } }))
    }

    // TODO: check if could be merge prior player request
    // merge damage entries
    const healthChangeEntries = combat?.rounds?.[roundId]?.[actionId]?.healthChangeEntries ?? {}
    const payload = { ...action, healthChangeEntries, isDone: true }

    // save action in combat
    const actionToSave = JSON.parse(JSON.stringify(payload)) // remove undefined values (throws error)
    promises.push(actionRepo.patch({ combatId: combat.id, roundId, id: actionId }, actionToSave))

    return Promise.all(promises)
  }
}
