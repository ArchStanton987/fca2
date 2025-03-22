import { DbCombatEntry } from "lib/combat/combats.types"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateFightParams = Partial<DbCombatEntry> & { id: string }

export default function updateFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return (params: UpdateFightParams) => combatRepo.setChildren({ id: params.id }, params)
}
