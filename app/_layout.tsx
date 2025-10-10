import { ReactNode, useEffect } from "react"
import { Platform, View } from "react-native"

import { Slot, SplashScreen } from "expo-router"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { useKeepAwake } from "expo-keep-awake"
import * as ScreenOrientation from "expo-screen-orientation"
import { StatusBar } from "expo-status-bar"
import { toastConfig } from "lib/common/ui/toast"
import ErrorUi from "lib/shared/ui/ErrorUi"
import { ErrorBoundary } from "react-error-boundary"
import Toast from "react-native-toast-message"

import fonts from "assets/fonts"
import AdditionalElementsProvider from "providers/AdditionalElementsProvider"
import UseCasesProvider from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

import AuthContainer from "../providers/AuthProvider"

let didInit = false

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } })

SplashScreen.preventAutoHideAsync()

const WithKeepAwake = ({ children }: { children: ReactNode }) => {
  useKeepAwake()
  return children
}

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

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  if (Platform.OS !== "web") {
    return (
      <WithKeepAwake>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1, backgroundColor: colors.primColor }}>
            <AuthContainer>
              <ErrorBoundary fallback={<ErrorUi />}>
                <AdditionalElementsProvider>
                  <UseCasesProvider>
                    <StatusBar hidden />
                    <Slot />
                    <Toast config={toastConfig} />
                  </UseCasesProvider>
                </AdditionalElementsProvider>
              </ErrorBoundary>
            </AuthContainer>
          </View>
        </QueryClientProvider>
      </WithKeepAwake>
    )
  }
  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: colors.primColor }}>
        <AuthContainer>
          <AdditionalElementsProvider>
            <UseCasesProvider>
              <StatusBar hidden />
              <Slot />
              <Toast config={toastConfig} />
            </UseCasesProvider>
          </AdditionalElementsProvider>
        </AuthContainer>
      </View>
    </QueryClientProvider>
  )
}
