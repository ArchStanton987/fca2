import { View } from "react-native"

import { Stack } from "expo-router"

import { useFonts } from "expo-font"

import fonts from "assets/fonts"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

import AuthContainer from "./containers/AuthContainer"

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts)

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <AuthContainer>
      <View style={{ backgroundColor: colors.primColor, flex: 1, padding: 10 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.primColor }
          }}
        />
      </View>
    </AuthContainer>
  )
}
