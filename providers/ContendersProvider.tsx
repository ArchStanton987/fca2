import { ReactNode, useMemo } from "react"

import PlayablesProvider from "lib/character/playables-provider"

import { useCombat } from "./CombatProvider"

export default function ContendersProvider({ children }: { children: ReactNode }) {
  const combat = useCombat()
  const contendersIds = useMemo(() => combat?.contendersIds ?? [], [combat])
  return <PlayablesProvider ids={contendersIds}>{children}</PlayablesProvider>
}
