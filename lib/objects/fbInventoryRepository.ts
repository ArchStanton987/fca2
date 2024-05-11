import dbKeys from "db/db-keys"

import { groupAddCollectible, groupUpdateValue, removeCollectible, updateValue } from "api/api-rtdb"

import { getRtdbSub } from "../common/utils/rtdb-utils"
import { Clothing, DbClothing } from "./data/clothings/clothings.types"
import consumablesMap from "./data/consumables/consumables"
import { Consumable, ConsumableId, DbConsumable } from "./data/consumables/consumables.types"
import { DbMiscObject, MiscObject } from "./data/misc-objects/misc-objects-types"
import { DbInventory } from "./data/objects.types"
import { DbWeapon, Weapon } from "./data/weapons/weapons.types"
import { ExchangeState } from "./objects-reducer"

export type InventoryCategory = keyof DbInventory
export type CollectibleInventoryCategory = keyof Pick<
  DbInventory,
  "weapons" | "clothings" | "consumables" | "miscObjects"
>
export type RecordInventoryCategory = keyof Pick<DbInventory, "ammo" | "caps">
export type InventoryCollectible = Weapon | Clothing | Consumable | MiscObject

type DbObjPayload = Partial<DbWeapon | DbClothing | DbConsumable | DbMiscObject>

const getDbConsumable = (id: ConsumableId, data?: Partial<DbConsumable>): DbConsumable => ({
  id,
  remainingUse: data?.remainingUse || consumablesMap[id].maxUsage
})

const getDbObject = (objectId: InventoryCollectible["id"], data?: DbObjPayload) => {
  const consumable = consumablesMap[objectId as ConsumableId]
  // TODO: use a generic instead of casting type
  if (consumable) return getDbConsumable(objectId as ConsumableId, data as Partial<DbConsumable>)
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
  },

  // REFACTOR: use an object for params
  // REFACTOR: build generic type
  updateCollectible: async (
    charId: string,
    category: CollectibleInventoryCategory,
    object: InventoryCollectible,
    objectChar: string,
    payload: any
  ) => {
    const objectPath = getCollectiblePath(charId, category, object.dbKey).concat("/", objectChar)
    const path = objectPath
    return updateValue(path, payload)
  }
}

export default fbInventoryRepository
