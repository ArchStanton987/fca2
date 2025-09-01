import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CombatStatusParams } from "lib/shared/db/api-rtdb"

import { DbCombatStatus } from "./combat-status.types"

export default class CombatStatusRtdbRepository extends RtdbRepository<
  DbCombatStatus,
  CombatStatusParams
> {
  getPath(params: CombatStatusParams) {
    return this.rtdb.getCombatStatus(params)
  }
}
