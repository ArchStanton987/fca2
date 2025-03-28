import { DbStatus } from "lib/character/status/status.types"
import repositoryMap from "lib/shared/db/get-repository"

export default function updateEnemy(dbType: keyof typeof repositoryMap = "rtdb") {
  const enemyRepo = repositoryMap[dbType].enemyRepository

  return (enemyId: string, params: DbStatus) =>
    enemyRepo.setChild({ id: enemyId, childKey: "status" }, params)
}
