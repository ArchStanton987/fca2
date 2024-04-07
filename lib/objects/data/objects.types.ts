import { AmmoType } from "./ammo/ammo.types"
import { DbClothing } from "./clothings/clothings.types"
import { DbConsumable } from "./consumables/consumables.types"
import { DbMiscObject } from "./misc-objects/misc-objects-types"
import { DbWeapon } from "./weapons/weapons.types"

export type DbEquipedObjects = {
  clothings?: Record<string, DbClothing>
  weapons?: Record<string, DbWeapon>
}

export type DbInventory = {
  ammo?: Record<AmmoType, number>
  clothings?: Record<string, DbClothing>
  consumables?: Record<string, DbConsumable>
  weapons?: Record<string, DbWeapon>
  miscObjects?: Record<string, DbMiscObject>
  caps: number
}
