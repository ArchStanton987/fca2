import { useMemo } from "react"
import { View } from "react-native"

import { Slot, useLocalSearchParams } from "expo-router"

import { useCharsNameInfo } from "lib/character/info/info-provider"
import LoadPlayables from "lib/character/use-cases/load-playables"
import { useSquadNpcs } from "lib/squad/use-cases/sub-squad"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

function Layout({ squadId }: { squadId: string }) {
  const { data: npcs } = useSquadNpcs(squadId)
  const npcsIds = Object.keys(npcs)
  const names = useCharsNameInfo(npcsIds)

  const navElements = names.map(entry => ({
    path: entry.id,
    label: entry.fullname
  }))

  return (
    <View style={styles.drawerLayout}>
      <AdminDrawer sectionId="npc" navElements={navElements} />
      <Spacer x={layout.globalPadding} />
      <Slot />
    </View>
  )
}

export default function NpcAdminLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: npcsRecord } = useSquadNpcs(squadId)
  const npcs = useMemo(() => Object.keys(npcsRecord), [npcsRecord])
  return (
    <LoadPlayables playablesIds={npcs}>
      <Layout squadId={squadId} />
    </LoadPlayables>
  )
}
