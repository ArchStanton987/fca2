import { ReactNode, createContext, useContext } from "react"

import { useLocalSearchParams } from "expo-router"

import { AmmoSet } from "lib/objects/data/ammo/ammo.types"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

import { Item, useSubAmmo, useSubCaps, useSubItems } from "./use-sub-inv-cat"

function InvSubsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const capsReq = useSubCaps(charId)
  const ammoReq = useSubAmmo(charId)
  const itemsReq = useSubItems(charId)

  const requests = [capsReq, ammoReq, itemsReq]

  const isPending = requests.some(r => r.isPending)
  const isError = requests.some(r => r.isError)

  if (isError) return <Txt>Erreur lors de la récupération de l&apos;inventaire</Txt>
  if (isPending) return <LoadingScreen />

  return children
}

const CapsContext = createContext(0)

export function useCaps() {
  const caps = useContext(CapsContext)
  if (typeof caps !== "number") throw new Error("CapsContext not found")
  return caps
}

function CapsProvider({ children }: { children: ReactNode }) {
  const caps = useCaps()
  return <CapsContext.Provider value={caps}>{children}</CapsContext.Provider>
}

const AmmoContext = createContext({} as Partial<AmmoSet>)

export function useAmmo() {
  const ammo = useContext(AmmoContext)
  if (!ammo) throw new Error("AmmoContext not found")
  return ammo
}

function AmmoProvider({ children }: { children: ReactNode }) {
  const ammo = useAmmo()
  return <AmmoContext.Provider value={ammo}>{children}</AmmoContext.Provider>
}

const ItemContext = createContext({} as Record<string, Item>)

export function useItems() {
  const items = useContext(ItemContext)
  if (!items) throw new Error("ItemContext not found")
  return items
}

function ItemsProvider({ children }: { children: ReactNode }) {
  const items = useItems()
  return <ItemContext.Provider value={items}>{children}</ItemContext.Provider>
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  return (
    <InvSubsProvider charId={charId}>
      <ItemsProvider>
        <AmmoProvider>
          <CapsProvider>{children}</CapsProvider>
        </AmmoProvider>
      </ItemsProvider>
    </InvSubsProvider>
  )
}
