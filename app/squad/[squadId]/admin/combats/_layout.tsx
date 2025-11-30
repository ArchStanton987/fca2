import { ReactNode, useMemo } from "react"
import { View } from "react-native"

import { Slot, useLocalSearchParams } from "expo-router"

import { useQueries } from "@tanstack/react-query"
import { SubCombats, getCombatOptions, useCombats } from "lib/combat/use-cases/sub-combats"
import { useSquadCombats } from "lib/squad/use-cases/sub-squad"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import LoadingScreen from "screens/LoadingScreen"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

function CombatsLoader({ children, ids }: { children: ReactNode; ids: string[] }) {
  const isPending = useQueries({
    queries: ids.map(id => getCombatOptions(id)),
    combine: r => r.some(q => q.isPending)
  })
  if (isPending) return <LoadingScreen />
  return children
}

function CombatsProvider({ combatsIds, children }: { combatsIds: string[]; children: ReactNode }) {
  return (
    <>
      <SubCombats ids={combatsIds} />
      <CombatsLoader ids={combatsIds}>{children}</CombatsLoader>
    </>
  )
}

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
    <CombatsProvider combatsIds={combatsIds}>
      <Layout combatsIds={combatsIds} />
    </CombatsProvider>
  )
}
