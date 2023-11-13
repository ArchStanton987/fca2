import { useEffect } from "react"

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
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
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
