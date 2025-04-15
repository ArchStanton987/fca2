import { View } from "react-native"

import { Slot } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { ActionProvider } from "providers/ActionProvider"
import CombatProvider from "providers/CombatProvider"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

const navElements = [
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]

export default function CombatLayout() {
  return (
    <CombatProvider>
      <ActionProvider>
        <View style={styles.drawerLayout}>
          <Drawer sectionId="combat" navElements={navElements} />
          <Spacer x={layout.globalPadding} />
          <Slot />
        </View>
      </ActionProvider>
    </CombatProvider>
  )
}
