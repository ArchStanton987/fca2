import dbKeys from "db/db-keys"

import { groupAddCollectible, groupUpdateValue, removeCollectible } from "api/api-rtdb"

import { getRtdbSub } from "../common/utils/rtdb-utils"
import { Clothing } from "./data/clothings/clothings.types"
import consumablesMap from "./data/consumables/consumables"
import { Consumable, ConsumableId } from "./data/consumables/consumables.types"
import { MiscObject } from "./data/misc-objects/misc-objects-types"
import { DbInventory } from "./data/objects.types"
import { Weapon } from "./data/weapons/weapons.types"
import { ExchangeState } from "./objects-reducer"

export type InventoryCategory = keyof DbInventory
export type CollectibleInventoryCategory = keyof Pick<
  DbInventory,
  "weapons" | "clothings" | "consumables" | "miscObjects"
>
export type RecordInventoryCategory = keyof Pick<DbInventory, "ammo" | "caps">
export type InventoryCollectible = Weapon | Clothing | Consumable | MiscObject

const getDbObject = (objectId: InventoryCollectible["id"]) => {
  const consumable = consumablesMap[objectId as ConsumableId]
  if (consumable) {
    return { id: objectId, remainingUse: consumable.maxUsage }
  }
  return { id: objectId }
}

const getContainerPath = (charId: string) => dbKeys.char(charId).inventory.index

const getCategoryPath = (charId: string, category: keyof DbInventory) =>
  getContainerPath(charId).concat("/", category)

const getCollectiblePath = (
  charId: string,
  category: CollectibleInventoryCategory,
  dbKey: InventoryCollectible["dbKey"]
) => getCategoryPath(charId, category).concat("/", dbKey)

const fbInventoryRepository = {
  getAll: (charId: string) => {
    const path = dbKeys.char(charId).inventory.index
    const sub = getRtdbSub<DbInventory>(path)
    return sub
  },

  // TODO: rename to update, add possibility to remove collectibles.
  // e.g.: provide an array of dbKeys to remove in related categories
  groupAdd: (charId: string, payload: ExchangeState) => {
    const recordsUpdates: { url: string; data: any }[] = []
    const addCollectiblesUpdates: { containerUrl: string; data: any }[] = []

    Object.entries(payload).forEach(([category, data]) => {
      if (category === "ammo") {
        Object.entries(data).forEach(([id, state]) => {
          const path = getCategoryPath(charId, category).concat("/", id)
          const newAmount = state.inInventory + state.count
          recordsUpdates.push({ url: path, data: newAmount })
        })
      }
      if (category === "caps") {
        Object.values(data).forEach(state => {
          const path = getCategoryPath(charId, category)
          const newAmount = state.inInventory + state.count
          recordsUpdates.push({ url: path, data: newAmount })
        })
      }
      Object.entries(data).forEach(([id, state]) => {
        const path = getCategoryPath(charId, category as keyof DbInventory)
        if (state.count > 0) {
          // TODO: fix ts warning
          const newData = getDbObject(id)
          for (let i = 0; i < state.count; i += 1) {
            addCollectiblesUpdates.push({ containerUrl: path, data: newData })
          }
        }
      })
    })

    const promises = [groupAddCollectible(addCollectiblesUpdates), groupUpdateValue(recordsUpdates)]
    return Promise.all(promises)
  },

  remove: async (
    charId: string,
    category: CollectibleInventoryCategory,
    object: Weapon | Clothing | Consumable | MiscObject
  ) => {
    const path = getCollectiblePath(charId, category, object.dbKey)
    return removeCollectible(path)
  }
}

export default fbInventoryRepository
