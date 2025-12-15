import { Fragment } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import { qkToPath, useSub } from "lib/shared/db/useSub"
import { getSquadOptions, squadCb } from "lib/squad/use-cases/sub-squad"

function Subscriber({ squadId }: { squadId: string }) {
  useSub(qkToPath(getSquadOptions(squadId).queryKey), squadCb)
  return null
}

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  return (
    <Fragment key={squadId}>
      <Subscriber squadId={squadId} />
      <Slot />
    </Fragment>
  )
}
