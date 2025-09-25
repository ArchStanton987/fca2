import { DbItem } from "lib/objects/data/objects.types"
import RtdbRepository from "lib/shared/db/RtdbRepository"
import { ItemsParams } from "lib/shared/db/api-rtdb"

export default class ItemRtdbRepository extends RtdbRepository<DbItem, ItemsParams> {
  getPath(params: ItemsParams) {
    return this.rtdb.getItems(params)
  }
}
