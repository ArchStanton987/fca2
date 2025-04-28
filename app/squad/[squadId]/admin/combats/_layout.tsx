import { View } from "react-native"

import { Slot } from "expo-router"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import { useSquad } from "contexts/SquadContext"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

export default function CombatsLayout() {
  const useCases = useGetUseCases()
  const { squadId } = useSquad()

  const combats = useRtdbSub(useCases.combat.subAll())
  const navElements = Object.entries(combats ?? {})
    .filter(([, entry]) => entry.squadId === squadId)
    .map(([id, entry]) => ({
      path: id,
      label: entry.title
    }))

  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="combats" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
