import { ReactNode, createContext, useContext } from "react"

import useSubInventories from "lib/inventory/use-sub-inventories"
import Inventory from "lib/objects/Inventory"

import Txt from "components/Txt"
import useCreatedElements from "hooks/context/useCreatedElements"
import LoadingScreen from "screens/LoadingScreen"

import { useCombat } from "./CombatProvider"

type InventoriesContextType = Record<string, Inventory>
const InventoriesContext = createContext<InventoriesContextType>({})

export default function InventoriesProvider({ children }: { children: ReactNode }) {
  const newElements = useCreatedElements()
  const { players, npcs } = useCombat()
  const contenders = Object.fromEntries(
    Object.entries({ ...players, ...npcs }).map(([id, c]) => [id, c.char])
  )

  const invSub = useSubInventories(contenders, newElements)

  if (invSub.isPending) return <LoadingScreen />
  if (invSub.isError) return <Txt>Erreur lors de la récupération des inventaires</Txt>

  return <InventoriesContext.Provider value={invSub.data}>{children}</InventoriesContext.Provider>
}

export function useInventories(): InventoriesContextType
export function useInventories(id: string): Inventory
export function useInventories<R = Inventory>(id: string, select: (state: Inventory) => R): R
export function useInventories(id?: string, select?: (state: Inventory) => unknown) {
  const inventories = useContext(InventoriesContext)
  if (!inventories) throw new Error("Inventories context not found")
  if (!id) return inventories
  return select?.(inventories[id])
}
