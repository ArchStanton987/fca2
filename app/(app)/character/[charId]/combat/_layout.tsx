import { Stack } from "expo-router"

import colors from "styles/colors"

export default function CombatLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.primColor } }}
    />
  )
}
