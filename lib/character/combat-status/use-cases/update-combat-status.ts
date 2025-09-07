import repositoryMap from "lib/shared/db/get-repository"

import { DbCombatStatus } from "../combat-status.types"

export type UpdateCombatStatusParams = {
  payload: Partial<DbCombatStatus>
  charId: string
}

export default function updateCombatStatus(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  return ({ payload, charId }: UpdateCombatStatusParams) =>
    combatStatusRepo.patch({ charId }, payload)
}
