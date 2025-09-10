import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

import Action from "../Action"
import Combat from "../Combat"

export type SaveActionParams = {
  action: Action
  contenders: Record<string, CombatStatus>
  combat: Combat
}

export default function saveAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const combatStateRepo = repositoryMap[dbType].combatStateRepository

  return async ({ action, combat, contenders }: SaveActionParams) => {
    const promises = []

    const { actorId, isCombinedAction, apCost = 0 } = action
    const actionId = combat.currActionId

    // if is part of a combined action & has still ap, set current actor id in combat, else reset it
    const { currAp } = contenders[actorId]
    const hasRemainingAp = currAp - apCost > 0
    if (isCombinedAction && hasRemainingAp) {
      promises.push(
        combatStateRepo.patchChild({ id: combat.id, childKey: "actorIdOverride" }, actorId)
      )
    } else {
      promises.push(combatStateRepo.deleteChild({ id: combat.id, childKey: "actorIdOverride" }))
    }

    // if has rolled dices, reset action bonus
    if (action.roll !== false && typeof action?.roll?.dice === "number") {
      promises.push(combatStatusRepo.deleteChild({ charId: actorId, childKey: "actionBonus" }))
    }

    // TODO: check if could be merge prior player request
    // merge damage entries
    const healthChangeEntries = action.healthChangeEntries ?? {}
    const payload = { ...action, healthChangeEntries, isDone: true }

    // save action in combat
    const actionToSave = JSON.parse(JSON.stringify(payload)) // remove undefined values (throws error)
    promises.push(actionRepo.patch({ combatId: combat.id, id: actionId }, actionToSave))

    return Promise.all(promises)
  }
}
