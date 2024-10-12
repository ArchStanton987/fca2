import { useEffect } from "react"
import { Platform, View } from "react-native"

import { Slot, SplashScreen } from "expo-router"

import { useFonts } from "expo-font"
import { useKeepAwake } from "expo-keep-awake"
import * as ScreenOrientation from "expo-screen-orientation"
import { StatusBar } from "expo-status-bar"
import { toastConfig } from "lib/common/ui/toast"
import Toast from "react-native-toast-message"

import fonts from "assets/fonts"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

import AuthContainer from "../providers/AuthProvider"

let didInit = false

SplashScreen.preventAutoHideAsync()

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

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync()
      })
    }
  }, [fontsLoaded])

  useKeepAwake()

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primColor }}>
      <AuthContainer>
        <StatusBar hidden />
        <Slot />
        <Toast config={toastConfig} />
      </AuthContainer>
    </View>
  )
}
