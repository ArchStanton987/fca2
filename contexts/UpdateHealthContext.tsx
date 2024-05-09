import { createContext, useContext } from "react"

import { HealthUpdateState, UpdateHealthAction } from "lib/character/health/health-reducer"

type UpdateHealthContextType = {
  state: HealthUpdateState
  dispatch: React.Dispatch<UpdateHealthAction>
}

export const UpdateHealthContext = createContext<UpdateHealthContextType>(
  {} as UpdateHealthContextType
)
export const useUpdateHealth = () => {
  const updateHealth = useContext(UpdateHealthContext)
  if (!updateHealth)
    throw new Error("useUpdateHealth must be used inside a UpdateHealthContext.Provider")
  return updateHealth
}
