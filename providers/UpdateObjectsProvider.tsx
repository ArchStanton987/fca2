import { useMemo, useReducer } from "react"

import objectsReducer, { defaultObjectExchange } from "lib/objects/objects-reducer"

import { UpdateObjectsContext } from "contexts/UpdateObjectsContext"

export default function UpdateObjectsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(objectsReducer, defaultObjectExchange)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <UpdateObjectsContext.Provider value={value}>{children}</UpdateObjectsContext.Provider>
}
