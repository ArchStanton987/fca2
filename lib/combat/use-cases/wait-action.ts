import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import { getActivePlayersWithAp } from "../utils/combat-utils"
import saveAction from "./save-action"

export type WaitActionParams = {
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  action: Action
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
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
    promises.push(saveAction(dbType)({ action, combat, contenders }))

    return Promise.all(promises)
  }
}
