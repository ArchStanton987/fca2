import { UseCasesConfig } from "lib/get-use-case.types"
import { Item } from "lib/inventory/item.mappers"
import consume from "lib/inventory/use-cases/consume"
import drop from "lib/inventory/use-cases/drop"
import toggleEquip from "lib/inventory/use-cases/toggle-equip"

import { DbAction } from "../combats.types"
import actions from "../const/actions"

export type CombatActionParams = {
  action: DbAction & { actorId: string }
  item?: Item
}

export default function itemAction(config: UseCasesConfig) {
  return async ({ action, item }: CombatActionParams) => {
    const { actionSubtype = "", actorId } = action
    const charId = actorId

    if (!(actionSubtype in actions.item.subtypes))
      throw new Error(`Wrong subtype: ${actionSubtype}`)

    switch (actionSubtype) {
      case "use": {
        if (!item) throw new Error("Item not found")
        if (item.category !== "consumables") throw new Error("Item is not consumable")
        return consume(config)({ charId, consumable: item })
      }
      case "equip":
      case "unequip": {
        if (!item) throw new Error("Item not found")
        const isEquipable = "isEquiped" in item
        if (!isEquipable) throw new Error("Item is not equipable")
        return toggleEquip(config)({ charId, itemDbKey: item.dbKey })
      }
      case "pickUp":
        // no op, handled in add object modal
        break
      case "drop":
        if (!item) throw new Error("Item not found")
        return drop(config)({ charId, item })
      case "throw": {
        if (!item) throw new Error("Item not found")
        return drop(config)({ charId, item })
      }
      default:
        throw new Error(`Unknown action subtype: ${actionSubtype}`)
    }

    return Promise.resolve()
  }
}
