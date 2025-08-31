import dbKeys from "db/db-keys"
import { CharType } from "lib/shared/db/api-rtdb"

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
import { Consumable, DbConsumable } from "./data/consumables/consumables.types"
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

export type DbObjPayload = Partial<DbWeapon | DbClothing | DbConsumable | DbMiscObject>

const getContainerPath = (charType: CharType, charId: string) =>
  dbKeys.char(charType, charId).inventory.index

const getCategoryPath = (charType: CharType, charId: string, category: keyof DbInventory) =>
  getContainerPath(charType, charId).concat("/", category)

const getCollectiblePath = (
  charType: CharType,
  charId: string,
  category: CollectibleInventoryCategory,
  dbKey: InventoryCollectible["dbKey"]
) => getCategoryPath(charType, charId, category).concat("/", dbKey)

const fbInventoryRepository = {
  getAll: (charType: CharType, charId: string) => {
    const path = dbKeys.char(charType, charId).inventory.index
    const sub = getRtdbSub<DbInventory>(path)
    return sub
  },

  groupAddCollectible: async (
    charType: CharType,
    charId: string,
    array: {
      category: CollectibleInventoryCategory
      dbObject: DbObjPayload
    }[]
  ) => {
    const updates: { containerUrl: string; data: any }[] = []
    array.forEach(({ category, dbObject }) => {
      const path = getCategoryPath(charType, charId, category)
      updates.push({ containerUrl: path, data: dbObject })
    })

    return groupAddCollectible(updates)
  },

  groupRemoveCollectible: async (
    charType: CharType,
    charId: string,
    array: { category: CollectibleInventoryCategory; dbKey: InventoryCollectible["dbKey"] }[]
  ) => {
    const urls = array.map(({ category, dbKey }) =>
      getCollectiblePath(charType, charId, category, dbKey)
    )
    return groupRemoveCollectible(urls)
  },

  // TODO: use an object for params
  updateCollectible: async (
    charType: CharType,
    charId: string,
    category: CollectibleInventoryCategory,
    object: InventoryCollectible,
    objectChar: string,
    payload: any
  ) => {
    const objectPath = getCollectiblePath(charType, charId, category, object.dbKey).concat(
      "/",
      objectChar
    )
    const path = objectPath
    return updateValue(path, payload)
  },
  remove: async (
    charType: CharType,
    charId: string,
    category: CollectibleInventoryCategory,
    object: Weapon | Clothing | Consumable | MiscObject
  ) => {
    const path = getCollectiblePath(charType, charId, category, object.dbKey)
    return removeCollectible(path)
  },

  groupUpdateRecords: async (
    charType: CharType,
    charId: string,
    array: { category: RecordInventoryCategory; id?: AmmoType; newValue: number }[]
  ) => {
    const updates: { url: string; data: any }[] = []
    array.forEach(({ category, id, newValue }) => {
      let path = getCategoryPath(charType, charId, category)
      if (id) {
        path = getCategoryPath(charType, charId, category).concat("/", id)
      }
      updates.push({ url: path, data: newValue })
    })
    return groupUpdateValue(updates)
  }
}

export default fbInventoryRepository
