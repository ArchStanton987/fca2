import Character from "lib/character/Character"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import healthMap from "lib/character/health/health"
import getStatusUseCases from "lib/character/status/status-use-cases"
import { DbStatus } from "lib/character/status/status.types"
import { applyMod } from "lib/common/utils/char-calc"

import { getRepository } from "../RepositoryBuilder"
import Inventory from "./Inventory"
import { CreatedElements, defaultCreatedElements } from "./created-elements"
import { AmmoType } from "./data/ammo/ammo.types"
import clothingsMap from "./data/clothings/clothings"
import { Clothing, ClothingId } from "./data/clothings/clothings.types"
import consumablesMap from "./data/consumables/consumables"
import { Consumable, ConsumableId } from "./data/consumables/consumables.types"
import miscObjectsMap from "./data/misc-objects/misc-objects"
import { MiscObject, MiscObjectId } from "./data/misc-objects/misc-objects-types"
import weaponsMap from "./data/weapons/weapons"
import { Weapon, WeaponId } from "./data/weapons/weapons.types"
import {
  CollectibleInventoryCategory,
  DbObjPayload,
  InventoryCollectible,
  RecordInventoryCategory
} from "./fbInventoryRepository"
import { ExchangeState } from "./objects-reducer"

const getInventoryUseCases = (
  db: keyof typeof getRepository = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) => {
  const repository = getRepository[db].inventory
  const equipedObjectsRepository = getRepository[db].equipedObjects
  const effectsUseCases = getEffectsUseCases(db)
  const statusUseCases = getStatusUseCases(db)

  const allClothings = { ...clothingsMap, ...createdElements.newClothings }
  const allConsumables = { ...consumablesMap, ...createdElements.newConsumables }
  const allMiscObjects = { ...miscObjectsMap, ...createdElements.newMiscObjects }

  const getObjectCategory = (object: Weapon | Clothing | Consumable | MiscObject) => {
    if (weaponsMap[object.id as WeaponId] !== undefined) return "weapons"
    if (allClothings[object.id as ClothingId] !== undefined) return "clothings"
    if (allConsumables[object.id as ConsumableId] !== undefined) return "consumables"
    if (allMiscObjects[object.id as MiscObjectId] !== undefined) return "miscObjects"
    throw new Error("Object category not found")
  }

  const getDbObject = (id: InventoryCollectible["id"]) => {
    const category = getObjectCategory({ id } as InventoryCollectible)
    if (category === "consumables") {
      return { id: id as ConsumableId, remainingUse: allConsumables[id as ConsumableId].maxUsage }
    }
    if (category === "weapons") return { id: id as WeaponId }
    if (category === "clothings") return { id: id as ClothingId }
    if (category === "miscObjects") return { id: id as MiscObjectId }
    throw new Error("Object category not found")
  }

  return {
    getAll: (charId: string) => repository.getAll(charId),

    exchange: (character: Character, payload: ExchangeState, inventory: Inventory) => {
      const recordsUpdates: {
        category: RecordInventoryCategory
        id?: AmmoType
        newValue: number
      }[] = []
      const addCollectiblesUpdates: {
        category: CollectibleInventoryCategory
        dbObject: DbObjPayload
      }[] = []
      const removeCollectiblesUpdates: {
        category: CollectibleInventoryCategory
        dbKey: InventoryCollectible["dbKey"]
      }[] = []

      Object.entries(payload).forEach(([category, data]) => {
        if (category === "ammo") {
          Object.entries(data).forEach(([id, state]) => {
            const newAmount = state.inInventory + state.count
            recordsUpdates.push({ category, id: id as AmmoType, newValue: newAmount })
          })
          return
        }
        if (category === "caps") {
          Object.values(data).forEach(state => {
            const newAmount = state.inInventory + state.count
            recordsUpdates.push({ category, newValue: newAmount })
          })
          return
        }
        Object.entries(data).forEach(([id, state]) => {
          if (state.count > 0) {
            for (let i = 0; i < state.count; i += 1) {
              addCollectiblesUpdates.push({
                category: category as CollectibleInventoryCategory,
                dbObject: getDbObject(id as InventoryCollectible["id"])
              })
            }
          }
          if (state.count < 0) {
            for (let i = 0; i > state.count; i -= 1) {
              const objToRemove = inventory[category as CollectibleInventoryCategory].filter(
                el => el.id === id
              )[Math.abs(i)]
              removeCollectiblesUpdates.push({
                category: category as CollectibleInventoryCategory,
                dbKey: objToRemove.dbKey
              })
            }
          }
        })
      })
      const promises = [
        repository.groupUpdateRecords(character.charId, recordsUpdates),
        repository.groupAddCollectible(character.charId, addCollectiblesUpdates),
        repository.groupRemoveCollectible(character.charId, removeCollectiblesUpdates)
      ]
      return Promise.all(promises)
    },

    throw: (charId: string, object: Weapon | Clothing | Consumable | MiscObject) => {
      const promises = []
      const category = getObjectCategory(object)
      const isEquipableCategory = category === "weapons" || category === "clothings"
      if ("isEquiped" in object && object.isEquiped && isEquipableCategory) {
        promises.push(equipedObjectsRepository.remove(charId, category, object.dbKey))
      }
      promises.push(repository.remove(charId, category, object))
      return Promise.all(promises)
    },

    consume: (character: Character, consumable: Consumable) => {
      const { charId } = character
      const { data, remainingUse } = consumable
      const { effectId, modifiers } = data

      const promises = []

      // add effect related to consumable
      if (effectId) {
        promises.push(effectsUseCases.add(character, effectId))
      }

      // apply modifiers related to consumable
      if (modifiers) {
        const updates: Partial<DbStatus> = {}
        modifiers.forEach(mod => {
          const { minValue, maxValue } = healthMap[mod.id]
          const calcValue = applyMod(character.status[mod.id], mod)
          const newValue = Math.min(Math.max(calcValue, minValue), maxValue)
          updates[mod.id] = newValue
        })
        promises.push(statusUseCases.groupUpdate(character, updates))
      }

      // handle object in inventory
      const shouldRemoveObject = remainingUse === undefined || remainingUse <= 1
      if (shouldRemoveObject) {
        promises.push(getInventoryUseCases(db, createdElements).throw(charId, consumable))
      } else {
        repository.updateCollectible(
          charId,
          "consumables",
          consumable,
          "remainingUse",
          remainingUse - 1
        )
      }
    }
  }
}

export default getInventoryUseCases
