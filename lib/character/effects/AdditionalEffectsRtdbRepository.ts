import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AdditionalEffectsParams } from "lib/shared/db/api-rtdb"

import { DbEffectData } from "./effects.types"

export type DbAdditionalEffects = Record<string, DbEffectData>

export default class AdditionalEffectsRtdbRepository extends RtdbRepository<
  DbAdditionalEffects,
  AdditionalEffectsParams
> {
  getPath(params: AdditionalEffectsParams) {
    return this.rtdb.getAdditionalEffects(params)
  }
}
