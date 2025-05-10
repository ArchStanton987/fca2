import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import { getIsActionEndingRound } from "../utils/combat-utils"
import saveAction from "./save-action"
import setNewRound from "./set-new-round"

export type MovementActionParams = {
  action: Action
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
}

export default function movementAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  return async (params: MovementActionParams) => {
    const { action, contenders, combat } = params
    const charId = action.actorId
    const { meta, status } = contenders[charId].char
    const { apCost = 0 } = action

    const promises = []

    if (apCost > status.currAp) throw new Error("Not enough AP to perform this action")

    // save action in combat
    promises.push(saveAction(dbType)({ action, combat, contenders }))

    // handle char status reset & new round creation
    const isActionEndingRound = getIsActionEndingRound(contenders, { apCost, ...action })
    if (isActionEndingRound) {
      promises.push(setNewRound(dbType)({ contenders, combat }))
    } else {
      const charType = meta.isNpc ? "npcs" : "characters"
      const newAp = status.currAp - apCost
      promises.push(statusRepo.setChild({ charId, charType, childKey: "currAp" }, newAp))
    }

    return Promise.all(promises)
  }
}
