import { View } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { ActionFormProvider } from "providers/ActionFormProvider"
import CombatProviders from "providers/CombatProviders"
import styles from "styles/DrawerLayout.styles"
import colors from "styles/colors"
import layout from "styles/layout"

const pNavElements = [
  { path: "combat-recap", label: "Recap" },
  { path: "action", label: "Action" }
]
const gmNavElements = [
  { path: "combat-recap", label: "Recap" },
  { path: "action-order", label: "MJ (ordre)" },
  { path: "gm-action", label: "MJ (action)" },
  { path: "gm-difficulty", label: "MJ (diff)" },
  { path: "gm-damage", label: "MJ (dég)" }
]
const getNav = (isGm: boolean, hasCombat: boolean) => {
  if (!hasCombat) return [{ path: "recap", label: "Recap" }]
  if (!isGm) return pNavElements
  return gmNavElements
}

export default function CombatLayout() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const isGameMaster = useCharInfo(charId, state => state.isNpc)
  const isInCombat = useCombatStatus(charId, state => state.combatId !== "")

  const navElements = getNav(isGameMaster.data, isInCombat.data)

  return (
    <CombatProviders>
      <ActionFormProvider>
        <View style={styles.drawerLayout}>
          <Drawer sectionId="combat" navElements={navElements} />
          <Spacer x={layout.globalPadding} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.primColor, padding: 0 }
            }}
          >
            <Stack.Protected guard={!isInCombat.data}>
              <Stack.Screen name="recap" />
            </Stack.Protected>
            <Stack.Protected guard={isInCombat.data}>
              <Stack.Screen name="combat-recap" />
            </Stack.Protected>
            <Stack.Protected guard={!isGameMaster.data}>
              <Stack.Screen name="action" />
            </Stack.Protected>
            <Stack.Protected guard={isGameMaster.data}>
              <Stack.Screen name="action-order" />
              <Stack.Screen name="gm-action" />
              <Stack.Screen name="gm-difficulty" />
              <Stack.Screen name="gm-damage" />
            </Stack.Protected>
          </Stack>
        </View>
      </ActionFormProvider>
    </CombatProviders>
  )
}
