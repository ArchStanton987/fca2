import { Tabs } from "expo-router/tabs"

import colors from "styles/colors"

export default function InventoryLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{
        backgroundColor: colors.primColor
      }}
    />
  )
}
