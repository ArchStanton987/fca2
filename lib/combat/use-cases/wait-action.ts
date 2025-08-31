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
    const { action } = params
    const charId = action.actorId

    const promises = []

    // set actor new status
    promises.push(statusRepo.setChild({ charId, childKey: "combatStatus" }, "wait"))

    return Promise.all(promises)
  }
}
