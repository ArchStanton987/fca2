import { ReactNode } from "react"

import { useQueries } from "@tanstack/react-query"
import { getDbAbilitiesOptions } from "lib/character/abilities/abilities-provider"
import { getBaseSpecialOptions } from "lib/character/abilities/base-special-provider"
import { getCharCombatHistoryOptions } from "lib/character/combat-history/combat-history-provider"
import { getCombatStatusOptions } from "lib/character/combat-status/combat-status-provider"
import { getEffectsOptions } from "lib/character/effects/effects-provider"
import { getHealthOptions } from "lib/character/health/health-provider"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/exp-provider"
import { getAmmoOptions, getCapsOptions, getItemsOptions } from "lib/inventory/use-sub-inv-cat"

import LoadingScreen from "screens/LoadingScreen"

const getPlayableOptions = (id: string) => [
  getCapsOptions(id),
  getAmmoOptions(id),
  getItemsOptions(id),
  getCharInfoOptions(id),
  getBaseSpecialOptions(id),
  getExpOptions(id),
  getEffectsOptions(id),
  getCombatStatusOptions(id),
  getCharCombatHistoryOptions(id),
  getHealthOptions(id),
  getDbAbilitiesOptions(id)
]

function Loader({ children, playablesIds }: { children: ReactNode; playablesIds: string[] }) {
  const isPending = useQueries({
    queries: playablesIds.flatMap(m => getPlayableOptions(m)),
    combine: r => r.some(q => q.isPending)
  })
  if (isPending) return <LoadingScreen />
  return children
}

export default function LoadPlayables({
  children,
  playablesIds
}: {
  children: ReactNode
  playablesIds: string[]
}) {
  return <Loader playablesIds={playablesIds}>{children}</Loader>
}
