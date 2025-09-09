import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CombatHistoryParams } from "lib/shared/db/api-rtdb"

import { DbCombatHistory } from "./combats.types"

export default class CombatHistoryRtdbRepository extends RtdbRepository<
  DbCombatHistory,
  CombatHistoryParams
> {
  getPath(params: CombatHistoryParams) {
    return this.rtdb.getCombatHistory(params)
  }
}
