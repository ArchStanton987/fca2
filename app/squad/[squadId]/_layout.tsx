import { Fragment } from "react"

import { Slot } from "expo-router"

import { useCurrCharStore } from "lib/character/character-store"

export default function SquadLayout() {
  const currCharId = useCurrCharStore(store => store.charId)

  return (
    <Fragment key={currCharId}>
      <Slot />
    </Fragment>
  )
}
