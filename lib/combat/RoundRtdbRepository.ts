import RtdbRepository from "lib/shared/db/RtdbRepository"
import { RoundParams } from "lib/shared/db/api-rtdb"

import { Action } from "./combats.types"

export default class RoundRtdbRepository extends RtdbRepository<
  Record<number, Record<number, Action>>,
  RoundParams
> {
  getPath(params: RoundParams) {
    return this.rtdb.getRound(params)
  }
}
