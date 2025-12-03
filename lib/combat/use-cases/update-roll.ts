import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"

export type UpdateRollParams = {
  combatId: string
  payload: Partial<DbAction["roll"]>
}

export default function updateRoll({ db }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId, payload }: UpdateRollParams) =>
    actionRepo.patchChild({ combatId, childKey: "roll" }, payload)
}
