import RtdbRepository from "lib/shared/db/RtdbRepository"
import { EffectsParams } from "lib/shared/db/api-rtdb"

import { DbEffect } from "./effects.types"

export default class EffectsRtdbRepository extends RtdbRepository<DbEffect, EffectsParams> {
  getPath(params: EffectsParams) {
    return this.rtdb.getEffects(params)
  }
}
