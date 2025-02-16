import { DbEffects } from "lib/character/effects/effects.types"
import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AdditionalParams } from "lib/shared/db/api-rtdb"

import { DbClothingData } from "./data/clothings/clothings.types"
import { DbConsumableData } from "./data/consumables/consumables.types"
import { DbMiscObjectData } from "./data/misc-objects/misc-objects-types"

export type DbAdditional = {
  clothings?: Record<string, DbClothingData>
  consumables?: Record<string, DbConsumableData>
  effects?: DbEffects
  miscObjects?: Record<string, DbMiscObjectData>
}

export default class AdditionalRtdbRepository extends RtdbRepository<
  DbAdditional,
  AdditionalParams
> {
  getPath(params: AdditionalParams) {
    return this.rtdb.getAdditionalData(params)
  }
}
