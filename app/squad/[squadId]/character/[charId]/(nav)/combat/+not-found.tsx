import { Redirect, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"

export default function CombatNotFound() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  return (
    <Redirect
      href={{
        pathname: "/squad/[squadId]/character/[charId]/combat/recap",
        params: { squadId, charId }
      }}
    />
  )
}
