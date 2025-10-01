import { ReactNode } from "react"

import CombatProvider from "./CombatProvider"
import CombatStateProvider from "./CombatStateProvider"
// import { CombatStatusesProvider } from "./CombatStatusesProvider"
import ContendersProvider from "./ContendersProvider"
import InventoriesProvider from "./PlayableInventoriesProvider"

export default function CombatProviders({ children }: { children: ReactNode }) {
  return (
    <CombatProvider>
      <CombatStateProvider>
        <InventoriesProvider>
          <ContendersProvider>
            {/* <CombatStatusesProvider> */}
            {children}
            {/* </CombatStatusesProvider> */}
          </ContendersProvider>
        </InventoriesProvider>
      </CombatStateProvider>
    </CombatProvider>
  )
}
