import { ReactNode } from "react"

import { useQueries, useQuery } from "@tanstack/react-query"
import { getDbAbilitiesOptions } from "lib/character/abilities/abilities-provider"
import { getBaseSpecialOptions } from "lib/character/abilities/base-special-provider"
import { getCharCombatHistoryOptions } from "lib/character/combat-history/combat-history-provider"
import { getCombatStatusOptions } from "lib/character/combat-status/combat-status-provider"
import { getEffectsOptions } from "lib/character/effects/effects-provider"
import { getHealthOptions } from "lib/character/health/health-provider"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/exp-provider"
import SubPlayables from "lib/character/use-cases/sub-playables"
import { getAmmoOptions, getCapsOptions, getItemsOptions } from "lib/inventory/use-sub-inv-cat"
import { qkToPath, useSub } from "lib/shared/db/useSub"
import { getSquadOptions, squadCb, useSquads } from "lib/squad/use-cases/sub-squad"

import LoadingScreen from "screens/LoadingScreen"

export const getPlayableOptions = (id: string) => [
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

function Subscriber({ squadId }: { squadId: string }) {
  useSub(qkToPath(getSquadOptions(squadId).queryKey), squadCb)
  return null
}

function SquadMembersSubscriber({ squadId }: { squadId: string }) {
  const { data: members = [] } = useSquads(squads => Object.keys(squads[squadId].members))
  return <SubPlayables squadId={squadId} playablesIds={members} />
}

function Loader({ children, squadId }: { children: ReactNode; squadId: string }) {
  const { isPending, data: members = [] } = useQuery({
    ...getSquadOptions(squadId),
    select: squad => Object.keys(squad.members)
  })
  const isMembersPending = useQueries({
    queries: members.flatMap(m => getPlayableOptions(m)),
    combine: r => r.some(q => q.isPending)
  })
  if (isPending || isMembersPending) return <LoadingScreen />
  return children
}

export default function SquadProvider({
  children,
  squadId
}: {
  children: ReactNode
  squadId: string
}) {
  return (
    <>
      <Subscriber squadId={squadId} />
      <SquadMembersSubscriber squadId={squadId} />
      <Loader squadId={squadId}>{children}</Loader>
    </>
  )
}
