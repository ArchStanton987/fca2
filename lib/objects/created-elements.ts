import { EffectData } from "lib/character/effects/effects.types"

import { ClothingData } from "./data/clothings/clothings.types"
import { ConsumableData } from "./data/consumables/consumables.types"
import { MiscObjectData } from "./data/misc-objects/misc-objects-types"
import { WeaponData } from "./data/weapons/weapons.types"

export type CreatedElements = {
  newClothings: Record<string, ClothingData>
  newEffects: Record<string, EffectData>
  newConsumables: Record<string, ConsumableData>
  newMiscObjects: Record<string, MiscObjectData>
  newWeapons: Record<string, WeaponData>
}
export const defaultCreatedElements = {
  newClothings: {},
  newEffects: {},
  newConsumables: {},
  newMiscObjects: {},
  newWeapons: {}
}
