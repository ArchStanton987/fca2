import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DbAction } from "../combats.types"

export type SaveActionParams = {
  action: DbAction & { actorId: string }
  contenders: Record<string, CombatStatus>
  combat: Combat
}

export default function saveAction({ db }: UseCaseConfig) {
  const actionRepo = repositoryMap[db].actionRepository
  const combatStatusRepo = repositoryMap[db].combatStatusRepository
  const combatStateRepo = repositoryMap[db].combatStateRepository
  const combatHistoryRepo = repositoryMap[db].combatHistoryRepository

  return async ({ action, combat, contenders }: SaveActionParams) => {
    const promises = []

    const { actorId, isCombinedAction, apCost = 0 } = action
    const roundId = combat.currRoundId
    const actionId = combat.currActionId

    // if is part of a combined action & has still ap, set current actor id in combat, else reset it
    const { currAp } = contenders[actorId]
    const hasRemainingAp = currAp - apCost > 0
    if (isCombinedAction && hasRemainingAp) {
      promises.push(
        combatStateRepo.setChild({ id: combat.id, childKey: "actorIdOverride" }, actorId)
      )
    } else {
      promises.push(combatStateRepo.setChild({ id: combat.id, childKey: "actorIdOverride" }, ""))
    }

    // if has rolled dices, reset action bonus
    if (action.roll !== false && typeof action?.roll?.dice === "number") {
      promises.push(combatStatusRepo.deleteChild({ charId: actorId, childKey: "actionBonus" }))
    }

    // save action in combat history
    const actionToSave = JSON.parse(JSON.stringify(action)) // remove undefined values (throws error)
    const payload = { ...actionToSave, isDone: true }
    combatHistoryRepo.patchChild({ id: combat.id, childKey: roundId }, { [actionId]: payload })

    // clear combat state
    promises.push(actionRepo.set({ combatId: combat.id }, { actorId: "" }))

    return Promise.all(promises)
  }
}
