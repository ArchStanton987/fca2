import { createContext, useContext } from "react"

import { ExchangeState, UpdateObjectAction } from "lib/objects/objects-reducer"

type UpdateObjectsContextType = {
  state: ExchangeState
  dispatch: React.Dispatch<UpdateObjectAction>
}

export const UpdateObjectsContext = createContext<UpdateObjectsContextType>(
  {} as UpdateObjectsContextType
)
export const useUpdateObjects = () => {
  const updateObjects = useContext(UpdateObjectsContext)
  if (!updateObjects)
    throw new Error("useUpdateObjects must be used inside a UpdateObjectsContext.Provider")
  return updateObjects
}
