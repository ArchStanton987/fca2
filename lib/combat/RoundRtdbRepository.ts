import RtdbRepository from "lib/shared/db/RtdbRepository"
import { RoundParams } from "lib/shared/db/api-rtdb"

import { DbAction } from "./combats.types"

export default class RoundRtdbRepository extends RtdbRepository<
  Record<number, Record<number, DbAction>>,
  RoundParams
> {
  getPath(params: RoundParams) {
    return this.rtdb.getRound(params)
  }
}
