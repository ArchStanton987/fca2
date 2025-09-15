import { useMemo } from "react"
import { View } from "react-native"

import { Slot } from "expo-router"

import { useSubGameCombatsInfo } from "lib/combat/use-cases/sub-combat"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import LoadingScreen from "screens/LoadingScreen"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

export default function CombatsLayout() {
  const { combats } = useSquad()

  const combatsIds = useMemo(() => Object.keys(combats), [combats])
  const combatsReq = useSubGameCombatsInfo(combatsIds)

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
