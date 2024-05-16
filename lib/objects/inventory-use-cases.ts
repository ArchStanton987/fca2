// import Character from "lib/character/Character"
import Character from "lib/character/Character"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import getStatusUseCases from "lib/character/status/status-use-cases"
import { DbStatus } from "lib/character/status/status.types"
import { applyMod } from "lib/common/utils/char-calc"

import { getRepository } from "../RepositoryBuilder"
import clothingsMap from "./data/clothings/clothings"
import { Clothing, ClothingId } from "./data/clothings/clothings.types"
import consumablesMap from "./data/consumables/consumables"
import { Consumable, ConsumableId } from "./data/consumables/consumables.types"
import miscObjectsMap from "./data/misc-objects/misc-objects"
import { MiscObject, MiscObjectId } from "./data/misc-objects/misc-objects-types"
import weaponsMap from "./data/weapons/weapons"
import { Weapon, WeaponId } from "./data/weapons/weapons.types"
import { ExchangeState } from "./objects-reducer"

const getObjectCategory = (object: Weapon | Clothing | Consumable | MiscObject) => {
  if (weaponsMap[object.id as WeaponId] !== undefined) return "weapons"
  if (clothingsMap[object.id as ClothingId] !== undefined) return "clothings"
  if (consumablesMap[object.id as ConsumableId] !== undefined) return "consumables"
  if (miscObjectsMap[object.id as MiscObjectId] !== undefined) return "miscObjects"
  throw new Error("Object category not found")
}

const getInventoryUseCases = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].inventory
  const equipedObjectsRepository = getRepository[db].equipedObjects
  const inventoryUseCases = getInventoryUseCases(db)
  const effectsUseCases = getEffectsUseCases(db)
  const statusUseCases = getStatusUseCases(db)

  return {
    getAll: (charId: string) => repository.getAll(charId),

    groupAdd: (charId: string, payload: ExchangeState) => repository.groupAdd(charId, payload),

    // TODO: group update
    // groupUpdate: (char: Character, payload: ExchangeState) => {},

    remove: (charId: string, object: Weapon | Clothing | Consumable | MiscObject) => {
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
          updates[mod.id] = applyMod(character.status[mod.id], mod)
        })
        promises.push(statusUseCases.groupUpdate(charId, updates))
      }

      // handle object in inventory
      const shouldRemoveObject = remainingUse === undefined || remainingUse <= 1
      if (shouldRemoveObject) {
        promises.push(inventoryUseCases.remove(charId, consumable))
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
