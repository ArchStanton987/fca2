import { Stack, useLocalSearchParams } from "expo-router"

import colors from "styles/colors"

export default function CombatLayout() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.primColor } }}
    >
      <Stack.Screen name="recap" initialParams={{ squadId, charId }} />
    </Stack>
  )
}
