import { Redirect, useLocalSearchParams } from "expo-router"

export default function CombatNotFound() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  return (
    <Redirect
      href={{
        pathname: "/squad/[squadId]/character/[charId]/combat/recap",
        params: { squadId, charId }
      }}
    />
  )
}
