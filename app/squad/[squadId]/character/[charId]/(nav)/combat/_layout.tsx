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

export default function CombatLayout() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const { combat, players, enemies } = useCombat()
  const charType = players && players[charId] ? "characters" : "enemies"
  const initiativeHref = useMemo(
    () => ({
      pathname: routes.modal.initiative,
      params: { charId, combatId: combat?.id, charType }
    }),
    [charId, combat?.id, charType]
  )
  const waitingHref = useMemo(
    () => ({
      pathname: routes.modal.waitingInitiative,
      params: { combatId: combat?.id, charType }
    }),
    [combat?.id, charType]
  )

  const prompts = getInitiativePrompts(charId, players ?? {}, enemies ?? {})

  useEffect(() => {
    if (prompts.playerShouldRollInitiative) {
      router.push(initiativeHref)
      return
    }
    if (prompts.shouldWaitOthers && !prompts.playerShouldRollInitiative) {
      router.push(waitingHref)
    }
  }, [initiativeHref, waitingHref, prompts])
  return (
    <View style={styles.drawerLayout}>
      <Drawer sectionId="combat" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
