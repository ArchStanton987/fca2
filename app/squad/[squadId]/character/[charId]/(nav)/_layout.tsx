import { View } from "react-native"

import { Slot, useLocalSearchParams } from "expo-router"

import Drawer from "components/Drawer/Drawer"
import { DrawerParams } from "components/Drawer/Drawer.params"
import { SearchParams } from "screens/ScreenParams"

export default function CharLayout() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>

  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <Slot />
      <Drawer squadId={squadId} charId={charId} />
    </View>
  )
}
