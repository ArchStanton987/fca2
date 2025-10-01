import { ReactNode, createContext, useMemo } from "react"

import {
  useAmmoQueries,
  useCapsQueries,
  useItemsQueries,
  useMultiSubAmmo,
  useMultiSubCaps,
  useMultiSubItems
} from "lib/inventory/use-sub-inv-cat"
import Inventory from "lib/objects/Inventory"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

import { useCombat } from "./CombatProvider"

type InventoriesContextType = Record<string, Inventory>
const InventoriesContext = createContext<InventoriesContextType>({})

function SubsProvider({ children, ids }: { children: ReactNode; ids: string[] }) {
  useMultiSubCaps(ids)
  const capsReq = useCapsQueries(ids)

  useMultiSubAmmo(ids)
  const ammoReq = useAmmoQueries(ids)

  useMultiSubItems(ids)
  const itemsReq = useItemsQueries(ids)

  const requests = [capsReq, ammoReq, itemsReq]

  const isPending = requests.some(r => r.isPending)
  const isError = requests.some(r => r.isError)

  if (isError) return <Txt>Erreur lors de la récupération des inventaires des combatants</Txt>
  if (isPending) return <LoadingScreen />

  return children
}

function ContextProvider({ children, ids }: { children: ReactNode; ids: string[] }) {
  const capsData = useCapsQueries(ids).data
  const ammoData = useAmmoQueries(ids).data
  const itemsData = useItemsQueries(ids).data

  const context = useMemo(
    () =>
      Object.fromEntries(
        ids.map((id, i) => {
          const caps = capsData[i].data ?? 0
          const ammo = ammoData[i].data ?? {}
          const items = itemsData[i].data ?? {}
          return [id, new Inventory({ caps, ammo, items })]
        })
      ),
    [ids, capsData, ammoData, itemsData]
  )

  return <InventoriesContext.Provider value={context}>{children}</InventoriesContext.Provider>
}

export default function InventoriesProvider({ children }: { children: ReactNode }) {
  const combat = useCombat()
  const contendersIds = useMemo(() => combat?.contendersIds ?? [], [combat])
  return (
    <SubsProvider ids={contendersIds}>
      <ContextProvider ids={contendersIds}>{children}</ContextProvider>
    </SubsProvider>
  )
}
