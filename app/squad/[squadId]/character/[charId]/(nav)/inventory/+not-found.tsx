import { Redirect, useLocalSearchParams } from "expo-router"

export default function NotFoundScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()

  return (
    <Redirect
      href={{
        pathname: "/squad/[squadId]/character/[charId]/inventory/weapons",
        params: { charId, squadId }
      }}
    />
  )
}
