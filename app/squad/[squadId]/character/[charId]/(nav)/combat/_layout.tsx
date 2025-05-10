import { View } from "react-native"

import { Stack } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import styles from "styles/DrawerLayout.styles"
import colors from "styles/colors"
import layout from "styles/layout"

const pNavElements = [
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]
const gmNavElements = [
  { path: "gm", label: "MJ" },
  { path: "action-order", label: "Ordre" },
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]

export default function CombatLayout() {
  const { meta } = useCharacter()
  const { isNpc } = meta
  const navElements = isNpc ? gmNavElements : pNavElements

  return (
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
  )
}
