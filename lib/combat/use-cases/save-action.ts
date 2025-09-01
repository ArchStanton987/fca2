import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DbAction } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"

export type SaveActionParams = {
  action: DbAction & { actorId: string }
  contenders: Record<string, CombatStatus>
  combat: Combat
}

export default function saveAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository
  const combatRepo = repositoryMap[dbType].combatRepository
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  return async ({ action, combat, contenders }: SaveActionParams) => {
    const promises = []

    const { actorId, isCombinedAction, apCost = 0 } = action
    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)

    // if is part of a combined action & has still ap, set current actor id in combat, else reset it
    const { currAp } = contenders[actorId]
    const hasRemainingAp = currAp - apCost > 0
    if (isCombinedAction && hasRemainingAp) {
      promises.push(combatRepo.patch({ id: combat.id }, { currActorId: actorId }))
    } else {
      promises.push(combatRepo.deleteChild({ id: combat.id, childKey: "currActorId" }))
    }

    // if has rolled dices, reset action bonus
    if (action.roll !== false && typeof action?.roll?.dice === "number") {
      promises.push(combatStatusRepo.deleteChild({ charId: actorId, childKey: "actionBonus" }))
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
