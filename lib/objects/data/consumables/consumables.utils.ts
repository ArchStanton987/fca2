/* eslint-disable import/prefer-default-export */
import { Clothing } from "../clothings/clothings.types"
import { MiscObject } from "../misc-objects/misc-objects-types"
import { Weapon } from "../weapons/weapons.types"
import { Consumable } from "./consumables.types"

export const isConsumableItem = (
  obj?: Clothing | Consumable | MiscObject | Weapon
): obj is Consumable => !!obj && "maxUsage" in obj.data
