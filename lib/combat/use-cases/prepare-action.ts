import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"
import {
  AC_BONUS_PER_AP_SPENT,
  MAX_ACTION_BONUS,
  MAX_ARMOR_CLASS_BONUS,
  SCORE_BONUS_PER_AP_SPENT
} from "../const/combat-const"

export type PrepareActionParams = {
  action: DbAction & { actorId: string }
  roundId: number
  combatStatuses: Record<string, CombatStatus>
}

export default function prepareAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  return ({ roundId, action, combatStatuses }: PrepareActionParams) => {
    const { apCost = 0, actionSubtype, actorId } = action
    const charId = actorId

    const promises = []

    //  calc new bonus
    const isVisualize = actionSubtype === "visualize"
    const maxValue = isVisualize ? MAX_ACTION_BONUS : MAX_ARMOR_CLASS_BONUS
    const multiplier = isVisualize ? SCORE_BONUS_PER_AP_SPENT : AC_BONUS_PER_AP_SPENT
    const newBonus = apCost * multiplier

    if (isVisualize) {
      const currBonus = combatStatuses[charId].actionBonus
      const actionBonus = Math.min(currBonus + newBonus, maxValue)
      promises.push(combatStatusRepo.patch({ charId }, { actionBonus }))
    } else {
      const currBonus = combatStatuses[charId].armorClassBonusRecord[roundId]
      const acBonus = Math.min(currBonus + newBonus, maxValue)
      promises.push(
        combatStatusRepo.patchChild(
          { charId, childKey: "armorClassBonusRecord" },
          { [roundId + 1]: newBonus, [roundId]: acBonus }
        )
      )
    }

    return Promise.all(promises)
  }
}
