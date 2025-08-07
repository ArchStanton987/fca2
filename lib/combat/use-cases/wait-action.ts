import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import { DbAction, PlayerCombatData } from "../combats.types"

export type WaitActionParams = {
  action: DbAction & { actorId: string }
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  return async (params: WaitActionParams) => {
    const { action, contenders } = params
    const charId = action.actorId

    const promises = []

    // set actor new status
    const charType = contenders[charId].char.meta.isNpc ? "npcs" : "characters"
    promises.push(statusRepo.setChild({ charId, charType, childKey: "combatStatus" }, "wait"))

    return Promise.all(promises)
  }
}
