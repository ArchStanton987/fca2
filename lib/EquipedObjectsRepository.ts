import database from "config/firebase"
import dbKeys from "db/db-keys"
import { onValue, ref } from "firebase/database"
import { Clothing, DbClothing } from "lib/objects/data/clothings/clothings.types"
import { DbWeapon, Weapon } from "lib/objects/data/weapons/weapons.types"

import { removeCollectible, updateValue } from "api/api-rtdb"

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

const equipedObjectsRepository = {
  get: (charId: string, category: string, dbKey: string) => {
    const path = getItemPath(charId, category, dbKey)
    const dbRef = ref(database, path)
    let equipedObject: DbClothing | DbWeapon | undefined
    const subscribe = (callback: () => void) => {
      const unsub = onValue(dbRef, snapshot => {
        equipedObject = snapshot.val()
        callback()
      })
      return () => {
        equipedObject = undefined
        unsub()
      }
    }
    return { subscribe, getSnapshot: () => equipedObject }
  },

  getByCategory: (charId: string, category: string) => {
    const path = getCategoryPath(charId, category)
    const dbRef = ref(database, path)
    let equipedObjectsCategory: DbEquipableCategory | undefined
    const subscribe = (callback: () => void) => {
      const unsub = onValue(dbRef, snapshot => {
        equipedObjectsCategory = snapshot.val()
        callback()
      })
      return () => {
        equipedObjectsCategory = undefined
        unsub()
      }
    }
    return { subscribe, getSnapshot: () => equipedObjectsCategory }
  },

  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    const dbRef = ref(database, path)
    let equipedObjects: DbEquipedObjects | undefined
    const subscribe = (callback: () => void) => {
      const unsub = onValue(dbRef, snapshot => {
        equipedObjects = snapshot.val()
        callback()
      })
      return () => {
        equipedObjects = undefined
        unsub()
      }
    }
    return { subscribe, getSnapshot: () => equipedObjects }
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

export default equipedObjectsRepository
