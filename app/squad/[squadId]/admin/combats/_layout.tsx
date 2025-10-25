import { useMemo } from "react"
import { View } from "react-native"

import { Slot, useLocalSearchParams } from "expo-router"

import { SubCombats, useCombats } from "lib/combat/use-cases/sub-combat"
import { useSquadCombats } from "lib/squad/use-cases/sub-squad"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

function Layout({ combatsIds }: { combatsIds: string[] }) {
  const combats = useCombats(combatsIds)

  const navElements = Object.entries(combats).map(([id, c]) => ({
    path: id,
    label: c.data.title
  }))

  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="combats" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}

export default function CombatLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: combats } = useSquadCombats(squadId)
  const combatsIds = useMemo(() => Object.keys(combats ?? {}), [combats])
  return (
    <SubCombats combatsIds={combatsIds}>
      <Layout combatsIds={combatsIds} />
    </SubCombats>
  )
}
