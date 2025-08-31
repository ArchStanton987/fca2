import RtdbRepository from "lib/shared/db/RtdbRepository"
import { ActionParams } from "lib/shared/db/api-rtdb"

import { DbAction } from "./combats.types"

export default class ActionRtdbRepository extends RtdbRepository<DbAction, ActionParams> {
  getPath(params: ActionParams) {
    return this.rtdb.getAction(params)
  }
}
