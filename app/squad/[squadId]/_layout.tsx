import { Fragment, useMemo } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import { useQuery } from "@tanstack/react-query"
import Squad from "lib/character/Squad"
import { useCurrCharStore } from "lib/character/character-store"
import SubPlayables from "lib/character/use-cases/sub-playables"
import { qkToPath, useSub } from "lib/shared/db/useSub"
import { DbSquad } from "lib/squad/squad-types"
import { getSquadOptions, useSquadMembers } from "lib/squad/use-cases/sub-squad"

import LoadingScreen from "screens/LoadingScreen"

function SubSquadCharacters({ squadId }: { squadId: string }) {
  const { data: npcsRecord } = useSquadMembers(squadId)
  const npcs = useMemo(() => Object.keys(npcsRecord), [npcsRecord])
  return <SubPlayables playablesIds={npcs} squadId={squadId} />
}

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()

  useSub(qkToPath(getSquadOptions(squadId).queryKey), (payload: DbSquad) => new Squad(payload))
  const { isPending } = useQuery(getSquadOptions(squadId))

  const currCharId = useCurrCharStore(store => store.charId)

  if (isPending) return <LoadingScreen />
  return (
    <Fragment key={squadId}>
      <SubSquadCharacters squadId={squadId} />
      <Fragment key={currCharId}>
        <Slot />
      </Fragment>
    </Fragment>
  )
}
