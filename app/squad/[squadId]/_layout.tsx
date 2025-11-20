import { Fragment } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import { useCurrCharStore } from "lib/character/character-store"
import { useSubSquad } from "lib/squad/use-cases/sub-squad"

import LoadingScreen from "screens/LoadingScreen"

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { isPending } = useSubSquad(squadId)

  const currCharId = useCurrCharStore(store => store.charId)

  if (isPending) return <LoadingScreen />

  return (
    <Fragment key={currCharId}>
      <Slot />
    </Fragment>
  )
}
