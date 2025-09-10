import { ReactNode } from "react"

import CombatStatusesProvider from "./CombatStatusesProvider"

export default function CombatProviders({ children }: { children: ReactNode }) {
  return <CombatStatusesProvider>{children}</CombatStatusesProvider>
}
