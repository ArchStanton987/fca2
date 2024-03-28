import { AmmoType } from "lib/objects/ammo/ammo.types"
import { ClothingId } from "lib/objects/clothings/clothings.types"
import { ConsumableId } from "lib/objects/consumables/consumables.types"
import { MiscObjectId } from "lib/objects/misc-objects/misc-objects-types"
import { WeaponId } from "lib/objects/weapons/weapons.types"

export type LootState = {
  weapons: { id: WeaponId; count: number }[]
  clothing: { id: ClothingId; count: number }[]
  consumables: { id: ConsumableId; count: number }[]
  miscObjects: { id: MiscObjectId; count: number }[]
  ammo: { id: AmmoType; count: number }
  caps: number
}
