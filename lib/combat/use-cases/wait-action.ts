import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"

export type WaitActionParams = {
  action: DbAction & { actorId: string }
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  return async (params: WaitActionParams) => {
    const { action } = params
    const charId = action.actorId

    const promises = []

    // set actor new status
    promises.push(combatStatusRepo.patch({ charId }, { combatStatus: "wait" }))

    return Promise.all(promises)
  }
}
