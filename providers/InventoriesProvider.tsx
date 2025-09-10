import { ReactNode, createContext, useContext } from "react"

import useSubInventories from "lib/inventory/use-sub-inventories"
import Inventory from "lib/objects/Inventory"

import Txt from "components/Txt"
import useCreatedElements from "hooks/context/useCreatedElements"

import { useContenders } from "./ContendersProvider"

type InventoriesContextType = Record<string, Inventory>
const InventoriesContext = createContext<InventoriesContextType>({})

export default function InventoriesProvider({ children }: { children: ReactNode }) {
  const newElements = useCreatedElements()
  const contenders = useContenders()

  const invSub = useSubInventories(contenders, newElements)

  if (invSub.isError) return <Txt>Erreur lors de la récupération des inventaires</Txt>

  return <InventoriesContext.Provider value={invSub.data}>{children}</InventoriesContext.Provider>
}

export function useInventories(id?: string) {
  const inventories = useContext(InventoriesContext)
  if (inventories === undefined) throw new Error("Inventories context not found")
  if (!id) return inventories
  return inventories[id]
}
