import repositoryMap from "lib/shared/db/get-repository"

import { DbEnemy } from "../enemy.types"

export type CreateEnemyParams = DbEnemy

export default function createEnemy(dbType: keyof typeof repositoryMap = "rtdb") {
  const enemyRepo = repositoryMap[dbType].enemyRepository

  return (payload: CreateEnemyParams) => enemyRepo.add({}, payload)
}
