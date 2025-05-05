import repositoryMap from "lib/shared/db/get-repository"

import { PauseAction, PlayerData } from "../combats.types"
import { getActivePlayersWithAp, getIsFightOver } from "../utils/combat-utils"

export type WaitActionParams = {
  combatId: string
  roundId: number
  actionId: number
  contenders: Record<string, PlayerData>
  action: PauseAction
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const actionRepo = repositoryMap[dbType].actionRepository
  return (params: WaitActionParams) => {
    // const { action, players, npcs, combatId, roundId, actionId } = params
    const { action, contenders, combatId, roundId, actionId } = params
    const charId = action.actorId
    // const charType = players[charId] ? "characters" : "npcs"

    const promises = []

    // check if fight is not over
    if (getIsFightOver(contenders)) throw new Error("Fight is over")

    // if no other player has AP, throw error as you can't wait for others
    const activePlayersWithAp = getActivePlayersWithAp(contenders)
    if (activePlayersWithAp.length <= 1) throw new Error("No other players with AP")

    // set actor new status
    const charType = contenders[charId].char.meta.isNpc ? "npcs" : "characters"
    promises.push(statusRepo.setChild({ charId, charType, childKey: "combatStatus" }, "wait"))

    // save action in combat
    promises.push(actionRepo.set({ combatId, roundId, actionId }, action))

    return Promise.all(promises)
  }
}
