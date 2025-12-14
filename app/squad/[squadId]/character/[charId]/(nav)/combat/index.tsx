import { Redirect, useLocalSearchParams } from "expo-router"

import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"

export default function CombatIndex() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const { data: hasCombat } = useCombatStatus(charId, cs => cs.combatId !== "")
  return (
    <Redirect
      href={{
        pathname: hasCombat
          ? "/squad/[squadId]/character/[charId]/combat/combat-recap"
          : "/squad/[squadId]/character/[charId]/combat/recap",
        params: { squadId, charId }
      }}
    />
  )
}
