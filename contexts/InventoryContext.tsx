import { createContext, useContext } from "react"

import Inventory from "lib/character/Inventory"

export const InventoryContext = createContext<Inventory | null>(null)
export const useInventory = () => {
  const inventory = useContext(InventoryContext)
  if (!inventory) throw new Error("useInventory must be used inside a InventoryContext.Provider")
  return inventory
}
