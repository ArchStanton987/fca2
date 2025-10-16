import { useMemo, useReducer } from "react"

import healthReducer, { defaultHealthUpdate } from "lib/character/health/health-reducer"

import { UpdateHealthContext } from "contexts/UpdateHealthContext"

function HealthUpdateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(healthReducer, defaultHealthUpdate)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <UpdateHealthContext.Provider value={value}>{children}</UpdateHealthContext.Provider>
}

export default function UpdatesProvider({ children }: { children: React.ReactNode }) {
  return <HealthUpdateProvider>{children}</HealthUpdateProvider>
}
