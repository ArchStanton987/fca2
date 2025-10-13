import { ReactNode } from "react"

import SubPlayables from "lib/character/use-cases/sub-playables"

import CombatProvider from "./CombatProvider"
import CombatStateProvider from "./CombatStateProvider"
// import { CombatStatusesProvider } from "./CombatStatusesProvider"
import ContendersProvider from "./ContendersProvider"
import InventoriesProvider from "./PlayableInventoriesProvider"

export default function CombatProviders({ children }: { children: ReactNode }) {
  return (
    <CombatProvider>
      <CombatStateProvider>
        <SubPlayables>
          <InventoriesProvider>
            <ContendersProvider>
              {/* <CombatStatusesProvider> */}
              {children}
              {/* </CombatStatusesProvider> */}
            </ContendersProvider>
          </InventoriesProvider>
        </SubPlayables>
      </CombatStateProvider>
    </CombatProvider>
  )
}
