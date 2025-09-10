import { ReactNode } from "react"

import CombatProvider from "./CombatProvider"
import CombatStateProvider from "./CombatStateProvider"
import { CombatStatusesProvider } from "./CombatStatusesProvider"
import ContendersProvider from "./ContendersProvider"
import InventoriesProvider from "./InventoriesProvider"

export default function CombatProviders({ children }: { children: ReactNode }) {
  return (
    <CombatProvider>
      <CombatStateProvider>
        <ContendersProvider>
          <InventoriesProvider>
            <CombatStatusesProvider>{children}</CombatStatusesProvider>
          </InventoriesProvider>
        </ContendersProvider>
      </CombatStateProvider>
    </CombatProvider>
  )
}
