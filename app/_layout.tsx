import { useEffect } from "react"
import { Platform } from "react-native"

import { Slot } from "expo-router"

import { useFonts } from "expo-font"
import * as ScreenOrientation from "expo-screen-orientation"

import fonts from "assets/fonts"
import LoadingScreen from "screens/LoadingScreen"

import AuthContainer from "../providers/AuthProvider"

let didInit = false

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts)

  const lockOrientation = async () => {
    if (Platform.OS === "web") return
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
  }

  useEffect(() => {
    if (!didInit) {
      didInit = true
      lockOrientation()
    }
  }, [])

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <AuthContainer>
      <Slot />
    </AuthContainer>
  )
}
