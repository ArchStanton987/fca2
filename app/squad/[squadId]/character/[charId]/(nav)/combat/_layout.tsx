import { View } from "react-native"

import { Slot } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

const navElements = [
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]
const dmNavElements = [
  { path: "gm", label: "MJ" },
  { path: "action-order", label: "Ordre" },
  { path: "recap", label: "Bagarre" },
  { path: "action", label: "Action" }
]

export default function CombatLayout() {
  const { meta } = useCharacter()
  const { isNpc } = meta

  return (
    <View style={styles.drawerLayout}>
      <Drawer sectionId="combat" navElements={isNpc ? dmNavElements : navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
