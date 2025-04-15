import RtdbRepository from "lib/shared/db/RtdbRepository"
import { RoundParams } from "lib/shared/db/api-rtdb"

import { DbCombatEntry } from "./combats.types"

export default class RoundRtdbRepository extends RtdbRepository<
  DbCombatEntry["rounds"],
  RoundParams
> {
  getPath(params: RoundParams) {
    return this.rtdb.getRound(params)
  }
}
