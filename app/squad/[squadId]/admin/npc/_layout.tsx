import { View } from "react-native"

import { Slot } from "expo-router"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import { useAdmin } from "contexts/AdminContext"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

export default function EnemiesLayout() {
  const { npc } = useAdmin()

  const navElements = Object.entries(npc ?? {}).map(([id, entry]) => ({
    path: id,
    label: entry.meta.firstname
  }))

  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="npc" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
