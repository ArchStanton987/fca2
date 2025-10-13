import { Suspense, useState } from "react"
import { Platform } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCurrCharStore, useSetCurrCharId } from "lib/character/character-store"
import SubPlayables from "lib/character/use-cases/sub-playables"
import { useSquad } from "lib/squad/use-cases/sub-squad"
import Toast from "react-native-toast-message"

import { ReactionProvider } from "providers/ReactionProvider"
import UpdatesProvider from "providers/UpdatesProvider"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"
import { getDDMMYYYY, getHHMM } from "utils/date"

const modalOptions: NativeStackNavigationOptions = {
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: {
    backgroundColor: colors.primColor,
    paddingBottom: 5
  }
}

export default function CharStack() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()

  const currCharId = useCurrCharStore(state => state.charId)
  const setChar = useSetCurrCharId()

  const { data: squad } = useSquad(squadId)
  const [currDatetime, setCurrDatetime] = useState(() => squad.datetime.toJSON())

  if (charId && currCharId === null) {
    setChar(charId)
  }

  if (squad.datetime.toJSON() !== currDatetime) {
    setCurrDatetime(squad.datetime.toJSON())
    const newDate = getDDMMYYYY(squad.datetime)
    const newHour = getHHMM(squad.datetime)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: Platform.OS === "web"
    })
  }

  if (!currCharId) return <LoadingScreen />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SubPlayables playablesIds={[currCharId]} datetime={squad.datetime}>
        <UpdatesProvider>
          <ReactionProvider>
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
              <Stack.Screen name="(modal)/update-health" options={modalOptions} />
              <Stack.Screen name="(modal)/update-skills" options={modalOptions} />
              <Stack.Screen name="(modal)/update-skills-confirmation" options={modalOptions} />
              <Stack.Screen name="(modal)/update-knowledges" options={modalOptions} />
            </Stack>
          </ReactionProvider>
        </UpdatesProvider>
      </SubPlayables>
    </Suspense>
  )
}
