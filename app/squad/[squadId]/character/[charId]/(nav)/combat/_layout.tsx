import { View } from "react-native"

import { Stack } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import CombatStateProvider from "providers/CombatStateProvider"
import CombatStatusesProvider from "providers/CombatStatusesProvider"
import ContendersProvider from "providers/ContendersProvider"
import InventoriesProvider from "providers/InventoriesProvider"
import styles from "styles/DrawerLayout.styles"
import colors from "styles/colors"
import layout from "styles/layout"

const pNavElements = [
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]
const gmNavElements = [
  { path: "recap", label: "Bagarre" },
  // { path: "action", label: "Action" },
  { path: "action-order", label: "MJ (ordre)" },
  { path: "gm-action", label: "MJ (action)" },
  { path: "gm-difficulty", label: "MJ (diff)" },
  { path: "gm-damage", label: "MJ (dég)" }
]

export default function CombatLayout() {
  const { meta } = useCharacter()
  const { isNpc } = meta
  const navElements = isNpc ? gmNavElements : pNavElements

  return (
    <InventoriesProvider>
      <CombatStatusesProvider>
        <CombatStateProvider>
          <ContendersProvider>
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
          </ContendersProvider>
        </CombatStateProvider>
      </CombatStatusesProvider>
    </InventoriesProvider>
  )
}
