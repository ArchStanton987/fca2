import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbCombatStatus } from "../combat-status.types"

export type UpdateCombatStatusParams = {
  payload: Partial<DbCombatStatus>
  charId: string
}

export default function updateCombatStatus({ db }: UseCasesConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return ({ payload, charId }: UpdateCombatStatusParams) =>
    combatStatusRepo.patch({ charId }, payload)
}
