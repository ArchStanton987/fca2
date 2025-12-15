import { Redirect, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"

export default function IndexScreen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()

  return (
    <Redirect
      href={{
        pathname: "/squad/[squadId]/character/[charId]/(nav)/main/recap",
        params: { charId, squadId }
      }}
    />
  )
}
