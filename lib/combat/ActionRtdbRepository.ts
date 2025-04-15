import RtdbRepository from "lib/shared/db/RtdbRepository"
import { ActionParams } from "lib/shared/db/api-rtdb"

import { Action } from "./combats.types"

export default class ActionRtdbRepository extends RtdbRepository<Action, ActionParams> {
  getPath(params: ActionParams) {
    return this.rtdb.getAction(params)
  }
}
