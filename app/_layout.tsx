import { Stack } from "expo-router"

import { useFonts } from "expo-font"

import fonts from "assets/fonts"

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts)

  if (!fontsLoaded) {
    return null
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  )
}
