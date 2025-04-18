import { View } from "react-native"

import { Slot } from "expo-router"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

export default function EnemiesLayout() {
  const useCases = useGetUseCases()

  const enemies = useRtdbSub(useCases.enemy.subAll())
  const navElements = Object.entries(enemies ?? {}).map(([id, entry]) => ({
    path: id,
    label: entry.name
  }))

  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="enemies" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
