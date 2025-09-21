import RtdbRepository from "lib/shared/db/RtdbRepository"
import { InventoryParams } from "lib/shared/db/api-rtdb"

import { DbInventory } from "./data/objects.types"

export default class InventoryRtdbRepository extends RtdbRepository<DbInventory, InventoryParams> {
  getPath(params: InventoryParams) {
    return this.rtdb.getInventory(params)
  }
}
