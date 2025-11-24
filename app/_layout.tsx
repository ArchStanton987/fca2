import { Suspense, useEffect } from "react"
import { Platform, View } from "react-native"

import { Slot, SplashScreen } from "expo-router"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useFonts } from "expo-font"
import * as ScreenOrientation from "expo-screen-orientation"
import { StatusBar } from "expo-status-bar"
import { toastConfig } from "lib/common/ui/toast"
import ErrorUi from "lib/shared/ui/ErrorUi"
import { ErrorBoundary } from "react-error-boundary"
import Toast from "react-native-toast-message"

import fonts from "assets/fonts"
import AdditionalElementsProvider from "providers/AdditionalElementsProvider"
import InitProvider from "providers/InitProvider"
import KeepAwakeProvider from "providers/KeepAwakeProvider"
import UseCasesProvider from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

import AuthContainer from "../providers/AuthProvider"

let didInit = false

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } })

// This code is only for TypeScript
// declare global {
//   interface Window {
//     __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient
//   }
// }

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

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primColor }}>
      <KeepAwakeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthContainer>
            <ErrorBoundary fallback={<ErrorUi />}>
              <Suspense fallback={<LoadingScreen />}>
                <InitProvider>
                  <AdditionalElementsProvider>
                    <UseCasesProvider>
                      <StatusBar hidden />
                      <Slot />
                      <Toast config={toastConfig} />
                    </UseCasesProvider>
                  </AdditionalElementsProvider>
                </InitProvider>
              </Suspense>
            </ErrorBoundary>
          </AuthContainer>
          {/* <ReactQueryDevtools initialIsOpen /> */}
        </QueryClientProvider>
      </KeepAwakeProvider>
    </View>
  )
}
