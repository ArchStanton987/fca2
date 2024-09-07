import dbKeys from "db/db-keys"
import { Clothing, DbClothing } from "lib/objects/data/clothings/clothings.types"
import { DbWeapon, Weapon } from "lib/objects/data/weapons/weapons.types"

import { removeCollectible, updateValue } from "api/api-rtdb"

import { getRtdbSub } from "../common/utils/rtdb-utils"
import { DbEquipedObjects, DbInventory } from "./data/objects.types"

export type EquipableCategory = keyof Pick<DbInventory, "weapons" | "clothings">
export type EquipableObject = Clothing | Weapon
export type DbEquipableObject = DbClothing | DbWeapon
export type DbEquipableCategory = Record<string, DbClothing> | Record<string, DbWeapon>

const getContainerPath = (charId: string) => dbKeys.char(charId).equipedObjects.index

const getCategoryPath = (charId: string, category: EquipableCategory) =>
  getContainerPath(charId).concat("/", category)

const getItemPath = (
  charId: string,
  category: EquipableCategory,
  dbKey: EquipableObject["dbKey"]
) => getCategoryPath(charId, category).concat("/", dbKey)

const fbEquipedObjectsRepository = {
  get: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) => {
    const path = getItemPath(charId, category, dbKey)
    return getRtdbSub<DbClothing | DbWeapon>(path)
  },

  getByCategory: (charId: string, category: EquipableCategory) => {
    const path = getCategoryPath(charId, category)
    return getRtdbSub<DbEquipableCategory>(path)
  },

  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    return getRtdbSub<DbEquipedObjects>(path)
  },

  add: async (charId: string, category: EquipableCategory, object: EquipableObject) => {
    const path = getItemPath(charId, category, object.dbKey)
    const payload = { id: object.id }
    return updateValue(path, payload)
  },

  remove: async (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) => {
    const path = getItemPath(charId, category, dbKey)
    return removeCollectible(path)
  },

  update: async (
    charId: string,
    category: EquipableCategory,
    dbKey: EquipableObject["dbKey"],
    object: DbEquipableObject
  ) => {
    const path = getItemPath(charId, category, dbKey)
    return updateValue(path, object)
  }
}

export default fbEquipedObjectsRepository
