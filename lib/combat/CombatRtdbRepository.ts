import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CombatParams } from "lib/shared/db/api-rtdb"

import { DbCombatEntry } from "./combats.types"

export default class CombatRtdbRepository extends RtdbRepository<DbCombatEntry, CombatParams> {
  getPath(params: CombatParams) {
    return this.rtdb.getCombat(params)
  }
}
