import { ReactNode, createContext, useContext } from "react"

import useSubInventories from "lib/inventory/use-sub-inventories"
import Inventory from "lib/objects/Inventory"

import Txt from "components/Txt"
import useCreatedElements from "hooks/context/useCreatedElements"
import LoadingScreen from "screens/LoadingScreen"

import { useContenders } from "./ContendersProvider"

type InventoriesContextType = Record<string, Inventory>
const InventoriesContext = createContext<InventoriesContextType>({})

export default function InventoriesProvider({ children }: { children: ReactNode }) {
  const newElements = useCreatedElements()
  const contenders = useContenders()

  const invReq = useSubInventories(contenders, newElements)

  if (invReq.isError) return <Txt>Erreur lors de la récupération des inventaires</Txt>

  if (Object.keys(contenders).length > 0 && invReq.isPending) return <LoadingScreen />

  return <InventoriesContext.Provider value={invReq.data}>{children}</InventoriesContext.Provider>
}

export function useInventories(): InventoriesContextType
export function useInventories(id: string): Inventory
export function useInventories(id?: string) {
  const inventories = useContext(InventoriesContext)
  if (inventories === undefined) throw new Error("Inventories context not found")
  if (!id) return inventories
  return inventories[id]
}
