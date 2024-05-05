import { createContext, useContext } from "react"

import { DbInventory } from "lib/objects/data/objects.types"
import { ExchangeState, ExchangeableObject, UpdateObjectAction } from "lib/objects/objects-reducer"

type UpdateObjectsContextType<C extends keyof DbInventory, O extends ExchangeableObject> = {
  state: ExchangeState
  dispatch: React.Dispatch<UpdateObjectAction<C, O>>
}

export const UpdateObjectsContext = createContext<
  UpdateObjectsContextType<keyof DbInventory, ExchangeableObject>
>({} as UpdateObjectsContextType<keyof DbInventory, ExchangeableObject>)
export const useUpdateObjects = () => {
  const updateObjects = useContext(UpdateObjectsContext)
  if (!updateObjects)
    throw new Error("useUpdateObjects must be used inside a UpdateObjectsContext.Provider")
  return updateObjects
}
