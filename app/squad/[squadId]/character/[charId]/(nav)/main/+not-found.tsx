import { Redirect, useLocalSearchParams } from "expo-router"

export default function IndexScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()

  return (
    <Redirect
      href={{
        pathname: "/squad/[squadId]/character/[charId]/(nav)/main/recap",
        params: { charId, squadId }
      }}
    />
  )
}
