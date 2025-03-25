import repositoryMap from "lib/shared/db/get-repository"

import { DbEnemy } from "../enemy.types"

export type CreateEnemyParams = { data: DbEnemy }

export default function createEnemy(dbType: keyof typeof repositoryMap = "rtdb") {
  const enemyRepo = repositoryMap[dbType].enemyRepository

  return ({ data }: CreateEnemyParams) => enemyRepo.add({}, data)
}
