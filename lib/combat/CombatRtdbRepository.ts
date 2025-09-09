import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CombatParams } from "lib/shared/db/api-rtdb"

import { DbCombat } from "./combats.types"

export default class CombatRtdbRepository extends RtdbRepository<DbCombat, CombatParams> {
  getPath(params: CombatParams) {
    return this.rtdb.getCombat(params)
  }
}
