import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AdditionalConsumablesParams } from "lib/shared/db/api-rtdb"

import { DbConsumableData } from "./consumables.types"

export type DbAdditionalConsumables = Record<string, DbConsumableData>

export default class AdditionalConsumablesRtdbRepository extends RtdbRepository<
  DbAdditionalConsumables,
  AdditionalConsumablesParams
> {
  getPath(params: AdditionalConsumablesParams) {
    return this.rtdb.getAdditionalConsumables(params)
  }
}
