import RtdbRepository from "lib/shared/db/RtdbRepository"
import { RollParams } from "lib/shared/db/api-rtdb"

import { Roll } from "./combats.types"

export default class RollRtdbRepository extends RtdbRepository<Roll, RollParams> {
  getPath(params: RollParams) {
    return this.rtdb.getRoll(params)
  }
}
