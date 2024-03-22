import { Stack } from "expo-router"

export default function CharLayoutModal() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }}>
      <Stack.Screen name="update-effects" />
      <Stack.Screen name="confirmation" />
    </Stack>
  )
}
