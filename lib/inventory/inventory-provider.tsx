import { ReactNode } from "react"

import { useMultiSubAmmo, useMultiSubCaps, useMultiSubItems } from "./use-sub-inv-cat"

export default function InventorySubsProvider({
  children,
  playablesIds
}: {
  children: ReactNode
  playablesIds: string[]
}) {
  useMultiSubCaps(playablesIds)
  useMultiSubAmmo(playablesIds)
  useMultiSubItems(playablesIds)

  return children
}
