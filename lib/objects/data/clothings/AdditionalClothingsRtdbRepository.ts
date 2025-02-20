import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AdditionalClothingsParams } from "lib/shared/db/api-rtdb"

import { DbClothingData } from "./clothings.types"

export type DbAdditionalClothings = {
  clothings?: Record<string, DbClothingData>
}

export default class AdditionalClothingsRtdbRepository extends RtdbRepository<
  DbAdditionalClothings,
  AdditionalClothingsParams
> {
  getPath(params: AdditionalClothingsParams) {
    return this.rtdb.getAdditionalClothings(params)
  }
}
