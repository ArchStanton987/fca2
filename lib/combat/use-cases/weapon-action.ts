import { UseCasesConfig } from "lib/get-use-case.types"
import drop from "lib/inventory/use-cases/drop"
import Weapon from "lib/objects/data/weapons/Weapon"
import loadWeapon from "lib/objects/data/weapons/use-cases/load-weapon"
import unloadWeapon from "lib/objects/data/weapons/use-cases/unload-weapon"
import useWeapon from "lib/objects/data/weapons/use-cases/use-weapon"

import { DbAction } from "../combats.types"

export type WeaponActionParams = {
  action: DbAction & { actorId: string }
  item?: Weapon
}

export default function weaponAction(config: UseCasesConfig) {
  return async ({ action, item }: WeaponActionParams) => {
    const { actionSubtype = "", actorId } = action
    const charId = actorId

    switch (actionSubtype) {
      case "hit":
        return null
      case "basic":
      case "aim":
      case "burst":
        if (!item) throw new Error("Missing item")
        return useWeapon(config)({ charId, weapon: item, actionId: actionSubtype })
      case "reload":
        if (!item) throw new Error("Missing item")
        return loadWeapon(config)({ charId, weapon: item })
      case "unload":
        if (!item) throw new Error("Missing item")
        return unloadWeapon(config)({ charId, weapon: item })
      case "throw":
        if (!item) throw new Error("Missing item")
        return drop(config)({ charId, item })
      default:
        throw new Error(`Unknown action subtype : ${actionSubtype} for weapon actions`)
    }
  }
}
