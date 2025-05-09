import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import { getCurrentRoundId, getIsActionEndingRound, getNewActionId } from "../utils/combat-utils"
import setNewRound from "./set-new-round"

export type MovementActionParams = {
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  action: Action
}

export default function movementAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const actionRepo = repositoryMap[dbType].actionRepository
  return async (params: MovementActionParams) => {
    const { action, contenders, combat } = params
    const charId = action.actorId
    const { meta, status } = contenders[charId].char
    const { apCost = 0 } = action

    const promises = []

    if (apCost > status.currAp) throw new Error("Not enough AP to perform this action")

    const actionId = getNewActionId(combat)
    const roundId = getCurrentRoundId(combat)
    promises.push(actionRepo.set({ combatId: combat.id, roundId, id: actionId }, action))

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
