import { createContext, useContext } from "react"

import { ClothingData, ClothingId } from "lib/objects/data/clothings/clothings.types"
import { ConsumableData, ConsumableId } from "lib/objects/data/consumables/consumables.types"
import { MiscObjectData, MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"

type AdditionalElContextType = {
  clothings: Record<ClothingId, ClothingData>
  consumables: Record<ConsumableId, ConsumableData>
  miscObjects: Record<MiscObjectId, MiscObjectData>
}

export const AdditionalElementsContext = createContext<AdditionalElContextType>(
  {} as AdditionalElContextType
)

export const useAdditionalElements = () => {
  const additionalElements = useContext(AdditionalElementsContext)
  if (!additionalElements)
    throw new Error(
      "useAdditionalElements must be used inside a AdditionalElementsContext.Provider"
    )
  return additionalElements
}
