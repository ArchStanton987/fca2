import { View } from "react-native"

import { Slot } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

const navElements = [
  { path: "weapons", label: "Armes" },
  { path: "clothings", label: "Armures" },
  { path: "consumables", label: "Consommables" },
  { path: "misc-objects", label: "Divers" },
  { path: "ammo", label: "Munitions" }
]

export default function InventoryLayout() {
  return (
    <View style={styles.drawerLayout}>
      <Drawer sectionId="inventory" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
