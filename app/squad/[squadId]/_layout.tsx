import { Fragment } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import { useCurrCharStore } from "lib/character/character-store"
import { qkToPath, useSub } from "lib/shared/db/useSub"
import { getSquadOptions, squadCb } from "lib/squad/use-cases/sub-squad"

function Subscriber({ squadId }: { squadId: string }) {
  useSub(qkToPath(getSquadOptions(squadId).queryKey), squadCb)
  return null
}

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const currCharId = useCurrCharStore(store => store.charId)
  return (
    <Fragment key={squadId}>
      <Subscriber squadId={squadId} />
      <Fragment key={currCharId}>
        <Slot />
      </Fragment>
    </Fragment>
  )
}
