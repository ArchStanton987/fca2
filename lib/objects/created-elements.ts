import { ClothingData } from "./data/clothings/clothings.types"
import { ConsumableData } from "./data/consumables/consumables.types"
import { MiscObjectData } from "./data/misc-objects/misc-objects-types"

export type CreatedElements = {
  newClothings: Record<string, ClothingData>
  // newEffects: Record<string, EffectData>
  newConsumables: Record<string, ConsumableData>
  newMiscObjects: Record<string, MiscObjectData>
}
export const defaultCreatedElements = {
  newClothings: {},
  // newEffects: {},
  newConsumables: {},
  newMiscObjects: {}
}
