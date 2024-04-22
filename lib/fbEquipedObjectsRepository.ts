import dbKeys from "db/db-keys"
import { Clothing, DbClothing } from "lib/objects/data/clothings/clothings.types"
import { DbWeapon, Weapon } from "lib/objects/data/weapons/weapons.types"

import { removeCollectible, updateValue } from "api/api-rtdb"

import { getRtdbSub } from "./common/utils/rtdb-utils"
import { DbEquipedObjects } from "./objects/data/objects.types"

const getContainerPath = (charId: string) => dbKeys.char(charId).equipedObjects.index
const getCategoryPath = (charId: string, category: string) =>
  getContainerPath(charId).concat("/", category)
const getItemPath = (charId: string, category: string, dbKey: string) =>
  getCategoryPath(charId, category).concat("/", dbKey)

export type EquipableCategory = "weapons" | "clothings"
export type EquipableObject = Clothing | Weapon
export type DbEquipableObject = DbClothing | DbWeapon
export type DbEquipableCategory = Record<string, DbClothing> | Record<string, DbWeapon>

const fbEquipedObjectsRepository = {
  get: (charId: string, category: string, dbKey: string) => {
    const path = getItemPath(charId, category, dbKey)
    const sub = getRtdbSub<DbClothing | DbWeapon>(path)
    return sub
  },

  getByCategory: (charId: string, category: string) => {
    const path = getCategoryPath(charId, category)
    const sub = getRtdbSub<DbEquipableCategory>(path)
    return sub
  },

  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    const sub = getRtdbSub<DbEquipedObjects>(path)
    return sub
  },

  add: async (
    charId: string,
    category: EquipableCategory,
    dbKey: string,
    payload: DbEquipableObject
  ) => {
    const path = getItemPath(charId, category, dbKey)
    return updateValue(path, payload)
  },

  remove: async (charId: string, category: string, dbKey: string) => {
    const path = getItemPath(charId, category, dbKey)
    return removeCollectible(path)
  }
}

export default fbEquipedObjectsRepository
