import { createContext, useContext } from "react"

import Squad from "lib/character/Squad"

export const SquadContext = createContext<Squad | null>(null)
export const useSquad = () => {
  const squad = useContext(SquadContext)
  if (!squad) throw new Error("useSquad must be used inside a SquadContext.Provider")
  return squad
}
