import { View } from "react-native"

import { Slot } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

const navElements = [
  { path: "recap", label: "Résumé" },
  { path: "effects", label: "Effets" },
  { path: "special", label: "SPECIAL" },
  { path: "sec-attr", label: "Attr.Sec" },
  { path: "skills", label: "Compétences" },
  { path: "knowledges", label: "Connaissances" },
  { path: "perks", label: "Traits" }
]

export default function CharLayout() {
  return (
    <View style={styles.drawerLayout}>
      <Drawer sectionId="main" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
