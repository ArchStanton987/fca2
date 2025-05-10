import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { PlayerCombatData, PrepareAction } from "../combats.types"
import { AC_BONUS_PER_AP_SPENT, SCORE_BONUS_PER_AP_SPENT } from "../const/combat-const"
import { getCurrentRoundId, getIsActionEndingRound } from "../utils/combat-utils"
import saveAction from "./save-action"
import setNewRound from "./set-new-round"
import updateContender from "./update-contender"

export type PrepareActionParams = {
  action: PrepareAction
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
}

export default function prepareAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository

  return ({ combat, action, contenders }: PrepareActionParams) => {
    const { apCost, actionSubtype, actorId } = action
    const { charId, meta, status } = contenders[actorId].char
    const { isNpc } = meta

    const roundId = getCurrentRoundId(combat)

    const promises = []

    //  calc new bonus
    const contenderType = isNpc ? "npcs" : "players"
    const isVisualize = actionSubtype === "visualize"
    const multiplier = isVisualize ? SCORE_BONUS_PER_AP_SPENT : AC_BONUS_PER_AP_SPENT
    const bonus = apCost * multiplier
    const prevChar = { ...combat[contenderType][charId] }
    let newContender = { ...prevChar }
    if (isVisualize) {
      newContender = { ...prevChar, actionBonus: prevChar.actionBonus + bonus }
    } else {
      const prevAcRecord = { ...prevChar.acBonusRecord }
      const newAcRecord = { ...prevAcRecord, [roundId + 1]: bonus }
      newContender = { ...prevChar, acBonusRecord: newAcRecord }
    }

    // update char new bonus in combat
    promises.push(
      updateContender(dbType)({ char: contenders[actorId].char, combat, payload: newContender })
    )

    // add new action
    promises.push(saveAction(dbType)({ action, combat }))

    // handle char status reset & new round creation
    const isActionEndingRound = getIsActionEndingRound(contenders, action)
    if (isActionEndingRound) {
      promises.push(setNewRound(dbType)({ contenders, combat }))
    } else {
      const charType = isNpc ? "npcs" : "characters"
      const newAp = status.currAp - apCost
      promises.push(statusRepo.setChild({ charId, charType, childKey: "currAp" }, newAp))
    }

    return Promise.all(promises)
  }
}
