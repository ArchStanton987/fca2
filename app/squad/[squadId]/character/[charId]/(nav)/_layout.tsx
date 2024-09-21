import { View } from "react-native"

import { Slot } from "expo-router"

import Drawer from "components/Drawer/Drawer"

export default function CharLayout() {
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <Slot />
      <Drawer />
    </View>
  )
}
