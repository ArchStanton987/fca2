import database from "config/firebase"
import dbKeys from "db/db-keys"
import { onValue, ref } from "firebase/database"

import { groupAddCollectible, groupUpdateValue } from "api/api-rtdb"

import { ClothingId } from "./objects/data/clothings/clothings.types"
import consumablesMap from "./objects/data/consumables/consumables"
import { ConsumableId } from "./objects/data/consumables/consumables.types"
import { MiscObjectId } from "./objects/data/misc-objects/misc-objects-types"
import { DbInventory } from "./objects/data/objects.types"
import { WeaponId } from "./objects/data/weapons/weapons.types"
import { ExchangeState } from "./objects/objects-reducer"

const getContainerPath = (charId: string) => dbKeys.char(charId).inventory.index
const getCategoryPath = (charId: string, category: string) =>
  getContainerPath(charId).concat("/", category)
const getElementPath = (charId: string, category: string, id: string) =>
  getCategoryPath(charId, category).concat("/", id)

const getDbObject = (objectId: WeaponId | ClothingId | ConsumableId | MiscObjectId) => {
  const consumable = consumablesMap[objectId as ConsumableId]
  if (consumable) {
    return { id: objectId, remainingUse: consumable.maxUsage }
  }
  return { id: objectId }
}

const fbInventoryRepository = {
  getAll: (charId: string) => {
    const path = dbKeys.char(charId).inventory.index
    const dbRef = ref(database, path)
    let inventory: DbInventory | undefined
    const subscribe = (callback: () => void) => {
      const unsub = onValue(dbRef, snapshot => {
        inventory = snapshot.val()
        callback()
      })
      return () => {
        inventory = undefined
        unsub()
      }
    }
    return { subscribe, getSnapshot: () => inventory }
  },

  // TODO: rename to update, add possibility to remove collectibles.
  // e.g.: provide an array of dbKeys to remove in related categories
  groupAdd: (charId: string, payload: ExchangeState) => {
    const recordsUpdates: { url: string; data: any }[] = []
    const addCollectiblesUpdates: { containerUrl: string; data: any }[] = []

    Object.entries(payload).forEach(([category, data]) => {
      if (category === "ammo") {
        Object.entries(data).forEach(([id, state]) => {
          const path = getElementPath(charId, category, id)
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
        const path = getCategoryPath(charId, category)
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
  }
}

export default fbInventoryRepository
