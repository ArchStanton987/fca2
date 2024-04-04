import { createContext, useContext } from "react"

import Character from "lib/character/Character"

export type AdminContextType = {
  characters: Record<string, Character>
}
export const AdminContext = createContext<AdminContextType | null>(null)
export const useAdmin = () => {
  const admin = useContext(AdminContext)
  if (!admin) throw new Error("useAdmin must be used inside a AdminContext.Provider")
  return admin
}
