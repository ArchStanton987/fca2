import { useEffect, useMemo } from "react"
import { View } from "react-native"

import { Slot, router, useLocalSearchParams } from "expo-router"

import { getInitiativePrompts } from "lib/combat/utils/combat-utils"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useCombat } from "providers/CombatProvider"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

const navElements = [
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]
const { initiative, waitingInitiative } = routes.modal

export default function CombatLayout() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const { combat, players, npcs } = useCombat()
  const charType = players && players[charId] ? "characters" : "npcs"
  const params = useMemo(
    () => ({ charId, combatId: combat?.id, charType }),
    [charId, charType, combat?.id]
  )

  const prompts = getInitiativePrompts(charId, players ?? {}, npcs ?? {})

  useEffect(() => {
    if (prompts.playerShouldRollInitiative) {
      router.push({ pathname: initiative, params })
      return
    }
    if (prompts.shouldWaitOthers && !prompts.playerShouldRollInitiative) {
      router.push({ pathname: waitingInitiative, params })
    }
  }, [params, prompts])
  return (
    <View style={styles.drawerLayout}>
      <Drawer sectionId="combat" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
