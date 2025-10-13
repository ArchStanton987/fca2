import Playable from "lib/character/Playable"
import { UseCasesConfig } from "lib/get-use-case.types"
import toggleEquip from "lib/inventory/use-cases/toggle-equip"
import { Item } from "lib/inventory/use-sub-inv-cat"
import { isConsumableItem } from "lib/objects/data/consumables/consumables.utils"
import getInventoryUseCases from "lib/objects/inventory-use-cases"

import Combat from "../Combat"
import { DbAction } from "../combats.types"
import actions from "../const/actions"

export type CombatActionParams = {
  action: DbAction & { actorId: string }
  combat: Combat
  contenders: Record<string, Playable>
  item?: Item
}

export default function itemAction(config: UseCasesConfig) {
  const { consume, drop } = getInventoryUseCases(dbType, newElements)

  return async ({ action, contenders, item }: CombatActionParams) => {
    const { actionSubtype = "", actorId } = action
    const char = contenders[actorId]
    const { charId } = char

    if (!(actionSubtype in actions.item.subtypes))
      throw new Error(`Wrong subtype: ${actionSubtype}`)

    switch (actionSubtype) {
      case "use": {
        if (!item) throw new Error("Item not found")
        const isConsumable = isConsumableItem(item)
        if (!isConsumable) throw new Error("Item is not consumable")
        return consume(char, item)
      }
      case "equip":
      case "unequip": {
        if (!item) throw new Error("Item not found")
        const isEquipable = "isEquiped" in item
        if (!isEquipable) throw new Error("Item is not equipable")
        return toggleEquip(config)(char, item)
      }
      case "pickUp":
        // no op, handled in add object modal
        break
      case "drop":
        if (!item) throw new Error("Item not found")
        return drop(charId, item)
      case "throw": {
        if (!item) throw new Error("Item not found")
        return drop(charId, item)
      }
      default:
        throw new Error(`Unknown action subtype: ${actionSubtype}`)
    }

    return Promise.resolve()
  }
}
