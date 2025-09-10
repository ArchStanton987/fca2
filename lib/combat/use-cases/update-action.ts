import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"

export type UpdateActionParams = {
  combatId: string
  payload: Partial<DbAction>
}

export default function updateAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return ({ combatId, payload }: UpdateActionParams) => {
    const updatedAction = JSON.parse(JSON.stringify(payload)) // sanitize payload, removes undefined

    return actionRepo.patch({ combatId }, updatedAction)
  }
}
