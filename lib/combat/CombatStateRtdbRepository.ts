import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CombatStateParams } from "lib/shared/db/api-rtdb"

import { DbCombatState } from "./combats.types"

export default class CombatStateRtdbRepository extends RtdbRepository<
  DbCombatState,
  CombatStateParams
> {
  getPath(params: CombatStateParams) {
    return this.rtdb.getCombatState(params)
  }
}
