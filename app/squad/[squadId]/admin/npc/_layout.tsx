import { View } from "react-native"

import { Slot, useLocalSearchParams } from "expo-router"

import { useCharsNameInfo } from "lib/character/info/info-provider"
import { useSquadNpcs } from "lib/squad/use-cases/sub-squad"

import AdminDrawer from "components/Drawer/AdminDrawer"
import Spacer from "components/Spacer"
import styles from "styles/DrawerLayout.styles"
import layout from "styles/layout"

export default function NpcsLayout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()

  const { data: npcs } = useSquadNpcs(squadId)

  const names = useCharsNameInfo(Object.keys(npcs))

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
