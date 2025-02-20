import subAdditionalEffects from "lib/character/effects/sub-additional-effects"
import subAdditionalClothings from "lib/objects/data/clothings/sub-additional-clothings"
import subAdditionalConsumables from "lib/objects/data/consumables/sub-additional-consumables"
import subAdditionalMisc from "lib/objects/data/misc-objects/sub-additional-misc"
import subAdditional from "lib/objects/sub-additional"
import { DbType } from "lib/shared/db/db.types"

import {
  AdditionalClothingsParams,
  AdditionalConsumablesParams,
  AdditionalEffectsParams,
  AdditionalMiscParams,
  AdditionalParams
} from "./api-rtdb"

export default function getUseCases(dbType: DbType = "rtdb") {
  return {
    additional: {
      subAdditionalData: (params: AdditionalParams = {}) => subAdditional(dbType)(params),
      subAdditionalClothings: (params: AdditionalClothingsParams = {}) =>
        subAdditionalClothings(dbType)(params),
      subAdditionalConsumables: (params: AdditionalConsumablesParams = {}) =>
        subAdditionalConsumables(dbType)(params),
      subAdditionalMisc: (params: AdditionalMiscParams = {}) => subAdditionalMisc(dbType)(params),
      subAdditionalEffects: (params: AdditionalEffectsParams = {}) =>
        subAdditionalEffects(dbType)(params)
    }
  }
}
