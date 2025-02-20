import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AdditionalEffectsParams } from "lib/shared/db/api-rtdb"

import { DbEffect } from "./effects.types"

export type DbAdditionalEffects = {
  effects?: Record<string, DbEffect>
}

export default class AdditionalEffectsRtdbRepository extends RtdbRepository<
  DbAdditionalEffects,
  AdditionalEffectsParams
> {
  getPath(params: AdditionalEffectsParams) {
    return this.rtdb.getAdditionalMiscObjects(params)
  }
}
