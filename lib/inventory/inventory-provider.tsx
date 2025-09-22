import { ReactNode, createContext, useContext } from "react"

import { AmmoSet } from "lib/objects/data/ammo/ammo.types"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

import {
  Item,
  useAmmoQuery,
  useCapsQuery,
  useItemsQuery,
  useSubAmmo,
  useSubCaps,
  useSubItems
} from "./use-sub-inv-cat"

function InvSubsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  useSubCaps(charId)
  const capsReq = useCapsQuery(charId)

  useSubAmmo(charId)
  const ammoReq = useAmmoQuery(charId)

  useSubItems(charId)
  const itemsReq = useItemsQuery(charId)

  const requests = [capsReq, ammoReq, itemsReq]

  const isPending = requests.some(r => r.isPending)
  const isError = requests.some(r => r.isError)

  if (isError) return <Txt>Erreur lors de la récupération de l&apos;inventaire</Txt>
  if (isPending) return <LoadingScreen />

  return children
}

const CapsContext = createContext(0)

function CapsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const caps = useCapsQuery(charId).data
  if (caps === undefined) return <LoadingScreen />
  return <CapsContext.Provider value={caps}>{children}</CapsContext.Provider>
}

export function useCaps() {
  const caps = useContext(CapsContext)
  if (typeof caps !== "number") throw new Error("CapsContext not found")
  return caps
}

const AmmoContext = createContext({} as Partial<AmmoSet>)

function AmmoProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const ammo = useAmmoQuery(charId).data
  if (ammo === undefined) return <LoadingScreen />
  return <AmmoContext.Provider value={ammo}>{children}</AmmoContext.Provider>
}

export function useAmmo() {
  const ammo = useContext(AmmoContext)
  if (!ammo) throw new Error("AmmoContext not found")
  return ammo
}

const ItemContext = createContext({} as Record<string, Item>)

function ItemsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const items = useItemsQuery(charId).data
  if (items === undefined) return <LoadingScreen />
  return <ItemContext.Provider value={items}>{children}</ItemContext.Provider>
}

export function useItems() {
  const items = useContext(ItemContext)
  if (!items) throw new Error("ItemContext not found")
  return items
}

export function InventoryProvider({ children, charId }: { children: ReactNode; charId: string }) {
  return (
    <InvSubsProvider charId={charId}>
      <ItemsProvider charId={charId}>
        <AmmoProvider charId={charId}>
          <CapsProvider charId={charId}>{children}</CapsProvider>
        </AmmoProvider>
      </ItemsProvider>
    </InvSubsProvider>
  )
}
