import { Fragment } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import { useCurrCharStore } from "lib/character/character-store"
import { SquadProvider } from "lib/squad/use-cases/sub-squad"

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()

  const currCharId = useCurrCharStore(store => store.charId)

  return (
    <SquadProvider squadId={squadId}>
      <Fragment key={currCharId}>
        <Slot />
      </Fragment>
    </SquadProvider>
  )
}
