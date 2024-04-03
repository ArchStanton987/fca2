import { Tabs } from "expo-router"

import colors from "styles/colors"

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: colors.primColor }}
    >
      <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
    </Tabs>
  )
}
