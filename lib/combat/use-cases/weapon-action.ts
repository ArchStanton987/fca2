import Playable from "lib/character/Playable"
import getWeaponsUseCases from "lib/objects/data/weapons/weapons-use-cases"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import getInventoryUseCases from "lib/objects/inventory-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"

export type WeaponActionParams = {
  action: DbAction & { actorId: string }
  contenders: Record<string, { char: Playable }>
  item?: Weapon
}

export default function weaponAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const { load, unload, use } = getWeaponsUseCases(dbType)
  const { drop } = getInventoryUseCases(dbType)
  return async ({ action, contenders, item }: WeaponActionParams) => {
    const { actionSubtype = "", actorId } = action
    const { char } = contenders[actorId]
    const { charId } = char

    switch (actionSubtype) {
      case "hit":
        return null
      case "basic":
      case "aim":
      case "burst":
        if (!item) throw new Error("Missing item")
        return use(char, item, actionSubtype)
      case "reload":
        if (!item) throw new Error("Missing item")
        return load(char, item)
      case "unload":
        if (!item) throw new Error("Missing item")
        return unload(char, item)
      case "throw":
        if (!item) throw new Error("Missing item")
        return drop(charId, item)
      default:
        throw new Error(`Unknown action subtype : ${actionSubtype} for weapon actions`)
    }
  }
}
