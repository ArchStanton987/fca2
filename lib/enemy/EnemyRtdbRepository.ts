import RtdbRepository from "lib/shared/db/RtdbRepository"
import { EnemiesParams } from "lib/shared/db/api-rtdb"

import { DbEnemy } from "./enemy.types"

export default class EnemyRtdbRepository extends RtdbRepository<DbEnemy, EnemiesParams> {
  getPath(params: EnemiesParams) {
    return this.rtdb.getEnemy(params)
  }
}
