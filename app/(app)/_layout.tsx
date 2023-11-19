import { Stack } from "expo-router"

import colors from "styles/colors"

export default function WelcomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primColor, padding: 10 }
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  )
}
