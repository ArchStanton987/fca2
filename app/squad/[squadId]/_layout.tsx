import { Fragment } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import { useCurrCharStore } from "lib/character/character-store"

import SquadProvider from "providers/SquadProvider"

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const currCharId = useCurrCharStore(store => store.charId)
  return (
    <Fragment key={squadId}>
      <Fragment key={currCharId}>
        <SquadProvider squadId={squadId}>
          <Slot />
        </SquadProvider>
      </Fragment>
    </Fragment>
  )
}
