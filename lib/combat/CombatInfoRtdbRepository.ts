import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CombatInfoParams } from "lib/shared/db/api-rtdb"

import { DbCombatInfo } from "./combats.types"

export default class CombatInfoRtdbRepository extends RtdbRepository<
  DbCombatInfo,
  CombatInfoParams
> {
  getPath(params: CombatInfoParams) {
    return this.rtdb.getCombatInfo(params)
  }
}
