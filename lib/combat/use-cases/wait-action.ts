import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { PauseAction, PlayerData } from "../combats.types"
import { getActivePlayersWithAp, getCurrentRoundId, getNewActionId } from "../utils/combat-utils"

export type WaitActionParams = {
  combat: Combat
  contenders: Record<string, PlayerData>
  action: PauseAction
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const actionRepo = repositoryMap[dbType].actionRepository
  return async (params: WaitActionParams) => {
    const { action, contenders, combat } = params
    const charId = action.actorId

    const promises = []

    // if no other player has AP, throw error as you can't wait for others
    const activePlayersWithAp = getActivePlayersWithAp(contenders)
    if (activePlayersWithAp.length <= 1) throw new Error("No other players with AP")

    // set actor new status
    const charType = contenders[charId].char.meta.isNpc ? "npcs" : "characters"
    promises.push(statusRepo.setChild({ charId, charType, childKey: "combatStatus" }, "wait"))

    // save action in combat
    const roundId = getCurrentRoundId(combat)
    const actionId = getNewActionId(combat)
    promises.push(actionRepo.add({ combatId: combat.id, roundId, id: actionId }, action))

    return Promise.all(promises)
  }
}
