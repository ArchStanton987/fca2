import { View } from "react-native"

import { Slot } from "expo-router"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

const navElements = [
  { path: "npc", label: "PNJ" },
  { path: "combat", label: "Combat" },
  { path: "effects", label: "Effets" },
  { path: "clothings", label: "Armures" },
  { path: "consumables", label: "Consommables" },
  { path: "misc-objects", label: "Divers" }
]

export default function AdminCreationLayout() {
  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="creation" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
