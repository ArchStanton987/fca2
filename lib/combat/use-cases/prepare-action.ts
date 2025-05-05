import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { PrepareAction } from "../combats.types"
import { AC_BONUS_PER_AP_SPENT, SCORE_BONUS_PER_AP_SPENT } from "../const/combat-const"
import { getCurrentActionId, getCurrentRoundId } from "../utils/combat-utils"
import updateContender from "./update-contender"

export type PrepareActionParams = {
  combat: Combat
  action: PrepareAction
  actor: Playable
}

export default function prepareAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository
  const statusRepo = repositoryMap[dbType].statusRepository

  return ({ combat, action, actor }: PrepareActionParams) => {
    const { id } = combat
    const { apCost, actionSubtype } = action
    const {
      charId,
      meta: { isNpc },
      status
    } = actor

    const promises = []

    //  calc new bonus
    const childKey = isNpc ? "npcs" : "players"
    const isVisualize = actionSubtype === "visualize"
    const multiplier = isVisualize ? SCORE_BONUS_PER_AP_SPENT : AC_BONUS_PER_AP_SPENT
    const bonus = apCost * multiplier
    const prevChar = { ...combat[childKey][charId] }
    const category = isVisualize ? "actionBonus" : "acBonus"
    const newBonus = prevChar[category] + bonus

    // update char new bonus in combat
    promises.push(
      updateContender(dbType)({
        id,
        playerId: charId,
        charType: childKey,
        ...prevChar,
        [category]: newBonus
      })
    )

    // update char ap
    const charType = isNpc ? "npcs" : "characters"
    const newAp = status.currAp - apCost
    promises.push(statusRepo.setChild({ charId, charType, childKey: "currAp" }, newAp))

    const actionId = getCurrentActionId(combat)
    const roundId = getCurrentRoundId(combat)

    // add new action
    promises.push(actionRepo.set({ combatId: id, roundId, actionId }, action))

    // return Promise.all(promises)
  }
}
