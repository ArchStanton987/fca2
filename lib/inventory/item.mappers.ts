import Clothing from "lib/objects/data/clothings/Clothing"
import { ClothingId } from "lib/objects/data/clothings/clothings.types"
import Consumable from "lib/objects/data/consumables/Consumable"
import { ConsumableId } from "lib/objects/data/consumables/consumables.types"
import MiscObject from "lib/objects/data/misc-objects/MiscObject"
import { MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"
import {
  DbClothing,
  DbConsumable,
  DbItem,
  DbMiscObject,
  DbWeapon
} from "lib/objects/data/objects.types"
import Weapon from "lib/objects/data/weapons/Weapon"
import { WeaponId } from "lib/objects/data/weapons/weapons.types"

import { AdditionalElContextType } from "providers/AdditionalElementsProvider"

export type Item = Clothing | Consumable | MiscObject | Weapon

export const itemFactory = (
  item: DbItem & { key: string },
  { weapons, clothings, consumables, miscObjects }: AdditionalElContextType
) => {
  switch (item.category) {
    case "clothings":
      return new Clothing(item, clothings)
    case "consumables":
      return new Consumable(item, consumables)
    case "misc":
      return new MiscObject(item, miscObjects)
    case "weapons":
      return new Weapon(item, weapons)
    default:
      throw new Error("unknown db item type")
  }
}

export const itemToDb = (item: Item): DbWeapon | DbConsumable | DbClothing | DbMiscObject => {
  const { category, id, isEquipped } = item
  switch (category) {
    case "weapons": {
      return {
        id: id as WeaponId,
        isEquipped,
        category,
        inMagazine: item.inMagazine ?? undefined
      }
    }
    case "clothings": {
      return { id: item.id as ClothingId, category, isEquipped }
    }
    case "consumables": {
      return {
        id: id as ConsumableId,
        category,
        isEquipped,
        remainingUse: item.remainingUse ?? undefined
      }
    }
    case "misc": {
      return { id: id as MiscObjectId, category, isEquipped }
    }
    default:
      throw new Error(`Unknown category in itemToDb`)
  }
}
