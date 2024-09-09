import { useEffect } from "react"
import { Platform } from "react-native"

import { NavigationContainer } from "@react-navigation/native"
import Router from "Router"
import { useFonts } from "expo-font"
import * as ScreenOrientation from "expo-screen-orientation"
import { StatusBar } from "expo-status-bar"
import { toastConfig } from "lib/common/ui/toast"
import Toast from "react-native-toast-message"

import fonts from "assets/fonts"
import AuthContainer from "providers/AuthProvider"
import LoadingScreen from "screens/LoadingScreen"

let didInit = false

export default function App() {
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
      <StatusBar hidden />
      <NavigationContainer>
        <Router />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </AuthContainer>
  )
}
