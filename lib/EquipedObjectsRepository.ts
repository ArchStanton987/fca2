import database from "config/firebase"
import dbKeys from "db/db-keys"
import { DataSnapshot, onValue, ref } from "firebase/database"
import { Clothing, DbClothing } from "lib/objects/data/clothings/clothings.types"
import { DbWeapon, Weapon } from "lib/objects/data/weapons/weapons.types"

import { removeCollectible, updateValue } from "api/api-rtdb"

const getContainerPath = (charId: string) => dbKeys.char(charId).equipedObjects.index
const getCategoryPath = (charId: string, category: string) =>
  getContainerPath(charId).concat("/", category)
const getItemPath = (charId: string, category: string, dbKey: string) =>
  getCategoryPath(charId, category).concat("/", dbKey)

export type EquipableCategory = "weapons" | "clothings"
export type EquipableObject = Clothing | Weapon
export type DbEquipableObject = DbClothing | DbWeapon

const equipedObjectsRepository = {
  get: (charId: string, category: string, dbKey: string) => {
    const path = getItemPath(charId, category, dbKey)
    const dbRef = ref(database, path)
    let equipedObject = null
    const unsub = onValue(dbRef, snapshot => {
      equipedObject = snapshot.val()
    })
    return { equipedObject, unsubscribe: unsub }
  },

  getByCategory: (charId: string, category: string) => {
    const path = getCategoryPath(charId, category)
    const dbRef = ref(database, path)
    let equipedObjects = null
    const unsub = onValue(dbRef, (snapshot: DataSnapshot) => {
      equipedObjects = snapshot.val()
    })
    return { equipedObjects, unsubscribe: unsub }
  },

  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    const dbRef = ref(database, path)
    let equipedObjects = null
    const unsub = onValue(dbRef, (snapshot: DataSnapshot) => {
      equipedObjects = snapshot.val()
    })
    return { equipedObjects, unsubscribe: unsub }
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
