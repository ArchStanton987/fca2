import { Slot } from "expo-router"

import { useFonts } from "expo-font"

import fonts from "assets/fonts"
import LoadingScreen from "screens/LoadingScreen"

import AuthContainer from "../providers/AuthProvider"

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts)

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <AuthContainer>
      <Slot />
    </AuthContainer>
  )
}
