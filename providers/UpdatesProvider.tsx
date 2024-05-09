import { useMemo, useReducer } from "react"

import healthReducer, { defaultHealthUpdate } from "lib/character/health/health-reducer"
import objectsReducer, { defaultObjectExchange } from "lib/objects/objects-reducer"

import { UpdateHealthContext } from "contexts/UpdateHealthContext"
import { UpdateObjectsContext } from "contexts/UpdateObjectsContext"

function ObjectsUpdateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(objectsReducer, defaultObjectExchange)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <UpdateObjectsContext.Provider value={value}>{children}</UpdateObjectsContext.Provider>
}

function HealthUpdateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(healthReducer, defaultHealthUpdate)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <UpdateHealthContext.Provider value={value}>{children}</UpdateHealthContext.Provider>
}

export default function UpdatesProvider({ children }: { children: React.ReactNode }) {
  return (
    <ObjectsUpdateProvider>
      <HealthUpdateProvider>{children}</HealthUpdateProvider>
    </ObjectsUpdateProvider>
  )
}
