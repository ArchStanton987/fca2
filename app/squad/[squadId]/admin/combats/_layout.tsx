import { View } from "react-native"

import { Slot } from "expo-router"

import { useQueries } from "@tanstack/react-query"
import { combatInfoOptions } from "lib/combat/use-cases/sub-combat"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import LoadingScreen from "screens/LoadingScreen"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

export default function CombatsLayout() {
  const { combats } = useSquad()

  const combatsIds = Object.keys(combats)
  const queries = combatsIds.map(id => combatInfoOptions(id))
  const combatsReq = useQueries({
    queries,
    combine: result => ({
      isPending: result.some(r => r.isPending),
      isError: result.some(r => r.isError),
      data: Object.fromEntries(result.map((r, i) => [combatsIds[i], r.data]))
    })
  })

  if (combatsReq.isPending) return <LoadingScreen />
  if (combatsReq.isError) return <Txt>Erreur lors de la récupération des combats</Txt>

  const navElements = Object.entries(combatsReq.data).map(([id, c]) => ({
    path: id,
    label: c?.title ?? id
  }))

  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="combats" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}
