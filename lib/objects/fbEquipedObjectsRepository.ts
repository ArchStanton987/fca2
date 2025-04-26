import dbKeys from "db/db-keys"
import { Clothing, DbClothing } from "lib/objects/data/clothings/clothings.types"
import { DbWeapon, Weapon } from "lib/objects/data/weapons/weapons.types"
import { CharType } from "lib/shared/db/api-rtdb"

import { removeCollectible, updateValue } from "api/api-rtdb"

import { getRtdbSub } from "../common/utils/rtdb-utils"
import { DbEquipedObjects, DbInventory } from "./data/objects.types"

export type EquipableCategory = keyof Pick<DbInventory, "weapons" | "clothings">
export type EquipableObject = Clothing | Weapon
export type DbEquipableObject = DbClothing | DbWeapon
export type DbEquipableCategory = Record<string, DbClothing> | Record<string, DbWeapon>

const getContainerPath = (charType: CharType, charId: string) =>
  dbKeys.char(charType, charId).equipedObjects.index

const getCategoryPath = (charType: CharType, charId: string, category: EquipableCategory) =>
  getContainerPath(charType, charId).concat("/", category)

const getItemPath = (
  charType: CharType,
  charId: string,
  category: EquipableCategory,
  dbKey: EquipableObject["dbKey"]
) => getCategoryPath(charType, charId, category).concat("/", dbKey)

const fbEquipedObjectsRepository = {
  get: (
    charType: CharType,
    charId: string,
    category: EquipableCategory,
    dbKey: EquipableObject["dbKey"]
  ) => {
    const path = getItemPath(charType, charId, category, dbKey)
    return getRtdbSub<DbClothing | DbWeapon>(path)
  },

  getByCategory: (charType: CharType, charId: string, category: EquipableCategory) => {
    const path = getCategoryPath(charType, charId, category)
    return getRtdbSub<DbEquipableCategory>(path)
  },

  getAll: (charType: CharType, charId: string) => {
    const path = getContainerPath(charType, charId)
    return getRtdbSub<DbEquipedObjects>(path)
  },

  add: async (
    charType: CharType,
    charId: string,
    category: EquipableCategory,
    object: EquipableObject
  ) => {
    const path = getItemPath(charType, charId, category, object.dbKey)
    const payload = { id: object.id }
    return updateValue(path, payload)
  },

  remove: async (
    charType: CharType,
    charId: string,
    category: EquipableCategory,
    dbKey: EquipableObject["dbKey"]
  ) => {
    const path = getItemPath(charType, charId, category, dbKey)
    return removeCollectible(path)
  },

  update: async (
    charType: CharType,
    charId: string,
    category: EquipableCategory,
    dbKey: EquipableObject["dbKey"],
    object: DbEquipableObject
  ) => {
    const path = getItemPath(charType, charId, category, dbKey)
    return updateValue(path, object)
  }
}

export default fbEquipedObjectsRepository
