import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DbAction } from "../combats.types"
import { AC_BONUS_PER_AP_SPENT, SCORE_BONUS_PER_AP_SPENT } from "../const/combat-const"
import { getCurrentRoundId } from "../utils/combat-utils"

export type PrepareActionParams = {
  action: DbAction & { actorId: string }
  combat: Combat
  combatStatuses: Record<string, CombatStatus>
}

export default function prepareAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  return ({ combat, action, combatStatuses }: PrepareActionParams) => {
    const { apCost = 0, actionSubtype, actorId } = action
    const charId = actorId

    const roundId = getCurrentRoundId(combat)

    const promises = []

    //  calc new bonus
    const isVisualize = actionSubtype === "visualize"
    const multiplier = isVisualize ? SCORE_BONUS_PER_AP_SPENT : AC_BONUS_PER_AP_SPENT
    const bonus = apCost * multiplier

    if (isVisualize) {
      const prevBonus = combatStatuses[charId].actionBonus
      const actionBonus = prevBonus + bonus
      promises.push(combatStatusRepo.patch({ charId }, { actionBonus }))
    } else {
      const currBonus = combatStatuses[charId].armorClassBonusRecord[roundId]
      promises.push(
        combatStatusRepo.patchChild(
          { charId, childKey: "armorClassBonusRecord" },
          { [roundId + 1]: bonus, [roundId]: currBonus + bonus }
        )
      )
    }

    return Promise.all(promises)
  }
}
