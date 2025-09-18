import { View } from "react-native"

import { Stack } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { ActionFormProvider } from "providers/ActionFormProvider"
import CombatProviders from "providers/CombatProviders"
import { useCombatStatus } from "providers/CombatStatusProvider"
import styles from "styles/DrawerLayout.styles"
import colors from "styles/colors"
import layout from "styles/layout"

const pNavElements = [
  { path: "recap", label: "Recap" },
  { path: "action", label: "Action" }
]
const gmNavElements = [
  { path: "recap", label: "Recap" },
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
  const { meta } = useCharacter()
  const { isNpc } = meta
  const { combatId } = useCombatStatus()

  const navElements = getNav(isNpc, combatId !== "")

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
            {navElements.map(({ path }) => (
              <Stack.Screen key={path} name={path} />
            ))}
          </Stack>
        </View>
      </ActionFormProvider>
    </CombatProviders>
  )
}
