import { AmmoSet } from "./ammo/ammo.types"
import { ClothingId, DbClothingData } from "./clothings/clothings.types"
import { ConsumableId, DbConsumableData } from "./consumables/consumables.types"
import { DbMiscObjectData, MiscObjectId } from "./misc-objects/misc-objects-types"
import { DbWeaponData, WeaponId } from "./weapons/weapons.types"

export type DbEquipedObjects = {
  clothings?: Record<string, DbClothing>
  weapons?: Record<string, DbWeapon>
}

export type ItemCategory = "weapons" | "clothings" | "consumables" | "misc"

export interface ItemInterface {
  id: string
  dbKey: string
  category: ItemCategory
  isEquipped: boolean
}

export interface DbWeapon extends ItemInterface {
  id: WeaponId
  category: "weapons"
  inMagazine?: number
  data?: Partial<DbWeaponData>
}

export interface DbClothing extends ItemInterface {
  id: ClothingId
  category: "clothings"
  data?: Partial<DbClothingData>
}
export interface DbConsumable extends ItemInterface {
  id: ConsumableId
  category: "consumables"
  data?: Partial<DbConsumableData>
  remainingUse?: number
}
export interface DbMiscObject extends ItemInterface {
  id: MiscObjectId
  category: "misc"
  data?: Partial<DbMiscObjectData>
}

export type DbItem = DbWeapon | DbClothing | DbConsumable | DbMiscObject

export type DbInventory = {
  ammo?: Partial<AmmoSet>
  caps: number
  items: Record<string, DbItem>
  // clothings?: Record<string, DbClothing>
  // consumables?: Record<string, DbConsumable>
  // weapons?: Record<string, DbWeapon>
  // miscObjects?: Record<string, DbMiscObject>
}
