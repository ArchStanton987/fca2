import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DataProvider from "providers/DataProvider"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

const modalOptions: NativeStackNavigationOptions = {
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: {
    backgroundColor: colors.primColor,
    paddingBottom: 5
  }
}

export default function CharStack() {
  const { charId, squadId } = useLocalSearchParams() as SearchParams<DrawerParams>

  return (
    <DataProvider squadId={squadId} charId={charId}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.primColor, padding: 10 }
        }}
      >
        <Stack.Screen name="(nav)" />
        <Stack.Screen name="(modal)/update-effects" options={modalOptions} />
        <Stack.Screen name="(modal)/update-effects-confirmation" options={modalOptions} />
        <Stack.Screen name="(modal)/update-objects" options={modalOptions} />
        <Stack.Screen name="(modal)/update-objects-confirmation" options={modalOptions} />
        <Stack.Screen name="(modal)/update-status" options={modalOptions} />
        <Stack.Screen name="(modal)/update-status-confirmation" options={modalOptions} />
      </Stack>
    </DataProvider>
  )
}
