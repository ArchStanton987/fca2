import RtdbRepository from "lib/shared/db/RtdbRepository"
import { StatusParams } from "lib/shared/db/api-rtdb"

import { DbStatus } from "./status.types"

export default class StatusRtdbRepository extends RtdbRepository<DbStatus, StatusParams> {
  getPath(params: StatusParams) {
    return this.rtdb.getStatus(params)
  }
}
