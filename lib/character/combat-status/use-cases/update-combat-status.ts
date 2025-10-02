import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import { DbCombatStatus } from "../combat-status.types"

export type UpdateCombatStatusParams = {
  payload: Partial<DbCombatStatus>
  charId: string
}

export default function updateCombatStatus({ db }: UseCaseConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return ({ payload, charId }: UpdateCombatStatusParams) =>
    combatStatusRepo.patch({ charId }, payload)
}
