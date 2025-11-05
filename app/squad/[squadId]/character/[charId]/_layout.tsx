import { Suspense, useState } from "react"
import { Platform } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCurrCharStore, useSetCurrCharId } from "lib/character/character-store"
import SubPlayables from "lib/character/use-cases/sub-playables"
import { useDatetime } from "lib/squad/use-cases/sub-squad"
import Toast from "react-native-toast-message"

import { ReactionProvider } from "providers/ReactionProvider"
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

  const { data: datetime } = useDatetime(squadId)
  const [currDatetime, setCurrDatetime] = useState(() => datetime.toJSON())

  if (charId && currCharId === null) {
    setChar(charId)
  }

  if (datetime.toJSON() !== currDatetime) {
    setCurrDatetime(datetime.toJSON())
    const newDate = getDDMMYYYY(datetime)
    const newHour = getHHMM(datetime)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: Platform.OS === "web"
    })
  }

  if (!currCharId) return <LoadingScreen />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SubPlayables playablesIds={[currCharId]} datetime={datetime}>
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
            <Stack.Screen name="(modal)/barter" options={modalOptions} />
            <Stack.Screen name="(modal)/barter-confirmation" options={modalOptions} />
            <Stack.Screen name="(modal)/update-exp" options={modalOptions} />
            <Stack.Screen name="(modal)/update-health" options={modalOptions} />
            <Stack.Screen name="(modal)/update-skills" options={modalOptions} />
            <Stack.Screen name="(modal)/update-skills-confirmation" options={modalOptions} />
            <Stack.Screen name="(modal)/update-knowledges" options={modalOptions} />
          </Stack>
        </ReactionProvider>
      </SubPlayables>
    </Suspense>
  )
}
