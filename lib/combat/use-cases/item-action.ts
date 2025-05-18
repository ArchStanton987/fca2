import Playable from "lib/character/Playable"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import getEquipedObjectsUseCases from "lib/objects/equiped-objects-use-cases"
import getInventoryUseCases from "lib/objects/inventory-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import actions from "../const/actions"

export type CombatActionParams = {
  action: Action
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  item: Clothing | Consumable | MiscObject | Weapon
}

// TODO: REFACTOR, create class for objects
function isConsumableItem(obj: Clothing | Consumable | MiscObject | Weapon): obj is Consumable {
  return "maxUsage" in obj.data
}

export default function itemAction(
  dbType: keyof typeof repositoryMap = "rtdb",
  newElements: CreatedElements = defaultCreatedElements
) {
  const { toggle } = getEquipedObjectsUseCases(dbType, newElements)
  const { consume, drop } = getInventoryUseCases(dbType, newElements)

  return async ({ action, contenders, item }: CombatActionParams) => {
    const { actionSubtype = "", actorId } = action
    const { char } = contenders[actorId]
    const { charId, meta } = char
    const charType = meta.isNpc ? "npcs" : "characters"

    if (!(actionSubtype in actions.item)) throw new Error(`Wrong subtype: ${actionSubtype}`)

    switch (actionSubtype) {
      case "use": {
        const isConsumable = isConsumableItem(item)
        if (!isConsumable) throw new Error("Item is not consumable")
        return consume(char, item)
      }
      case "equip":
      case "unequip": {
        const isEquipable = "isEquiped" in item
        if (!isEquipable) throw new Error("Item is not equipable")
        return toggle(char, item)
      }
      case "pickUp":
        // no op, handled in add object modal
        break
      case "drop":
        return drop(charType, charId, item)
      case "throw": {
        // TODO: manage aim & health change
        return drop(charType, charId, item)
      }
      default:
        throw new Error(`Unknown action subtype: ${actionSubtype}`)
    }

    return Promise.resolve()
  }
}
