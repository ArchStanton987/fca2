import { createContext, useContext } from "react"

import { EffectData } from "lib/character/effects/effects.types"
import { defaultCreatedElements } from "lib/objects/created-elements"
import { ClothingData, ClothingId } from "lib/objects/data/clothings/clothings.types"
import { ConsumableData, ConsumableId } from "lib/objects/data/consumables/consumables.types"
import { MiscObjectData, MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"

export type AdditionalElContextType = {
  newClothings: Record<ClothingId, ClothingData>
  newConsumables: Record<ConsumableId, ConsumableData>
  newMiscObjects: Record<MiscObjectId, MiscObjectData>
  newEffects: Record<string, EffectData>
}

export const AdditionalElementsContext = createContext<AdditionalElContextType>(
  defaultCreatedElements as AdditionalElContextType
)

export const useAdditionalElements = () => {
  const additionalElements = useContext(AdditionalElementsContext)
  if (!additionalElements)
    throw new Error(
      "useAdditionalElements must be used inside a AdditionalElementsContext.Provider"
    )
  return additionalElements
}
