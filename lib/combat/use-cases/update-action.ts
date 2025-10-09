import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"

export type UpdateActionParams = {
  combatId: string
  payload: Partial<DbAction>
}

export default function updateAction({ db }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId, payload }: UpdateActionParams) => {
    const updatedAction = JSON.parse(JSON.stringify(payload)) // sanitize payload, removes undefined

    return actionRepo.patch({ combatId }, updatedAction)
  }
}
