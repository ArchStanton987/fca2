import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AdditionalMiscParams } from "lib/shared/db/api-rtdb"

import { DbMiscObjectData } from "./misc-objects-types"

export type DbAdditionalMisc = {
  miscObjects?: Record<string, DbMiscObjectData>
}

export default class AdditionalMiscRtdbRepository extends RtdbRepository<
  DbAdditionalMisc,
  AdditionalMiscParams
> {
  getPath(params: AdditionalMiscParams) {
    return this.rtdb.getAdditionalMiscObjects(params)
  }
}
