import dbKeys from "db/db-keys"

import {
  groupAddCollectible,
  groupRemoveCollectible,
  groupUpdateValue,
  removeCollectible,
  updateValue
} from "api/api-rtdb"

import { getRtdbSub } from "../common/utils/rtdb-utils"
import { AmmoType } from "./data/ammo/ammo.types"
import { Clothing, DbClothing } from "./data/clothings/clothings.types"
import consumablesMap from "./data/consumables/consumables"
import { Consumable, ConsumableId, DbConsumable } from "./data/consumables/consumables.types"
import { DbMiscObject, MiscObject } from "./data/misc-objects/misc-objects-types"
import { DbInventory } from "./data/objects.types"
import { DbWeapon, Weapon } from "./data/weapons/weapons.types"

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

  groupAddCollectible: async (
    charId: string,
    array: {
      category: CollectibleInventoryCategory
      objectId: InventoryCollectible["id"]
    }[]
  ) => {
    const updates: { containerUrl: string; data: any }[] = []
    array.forEach(({ category, objectId }) => {
      const path = getCategoryPath(charId, category)
      const dbObject = getDbObject(objectId)
      updates.push({ containerUrl: path, data: dbObject })
    })

    return groupAddCollectible(updates)
  },

  groupRemoveCollectible: async (
    charId: string,
    array: { category: CollectibleInventoryCategory; dbKey: InventoryCollectible["dbKey"] }[]
  ) => {
    const urls = array.map(({ category, dbKey }) => getCollectiblePath(charId, category, dbKey))
    return groupRemoveCollectible(urls)
  },

  // TODO: use an object for params
  // TODO: build generic type
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
  },
  remove: async (
    charId: string,
    category: CollectibleInventoryCategory,
    object: Weapon | Clothing | Consumable | MiscObject
  ) => {
    const path = getCollectiblePath(charId, category, object.dbKey)
    return removeCollectible(path)
  },

  groupUpdateRecords: async (
    charId: string,
    array: { category: RecordInventoryCategory; id?: AmmoType; newValue: number }[]
  ) => {
    const updates: { url: string; data: any }[] = []
    array.forEach(({ category, id, newValue }) => {
      let path = getCategoryPath(charId, category)
      if (id) {
        path = getCategoryPath(charId, category).concat("/", id)
      }
      updates.push({ url: path, data: newValue })
    })
    return groupUpdateValue(updates)
  }
}

export default fbInventoryRepository
