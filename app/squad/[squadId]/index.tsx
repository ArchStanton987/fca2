import { Suspense } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import PickCharacterCard from "lib/character/ui/PickCharacterCard/PickCharacterCard"
import WelcomeHeader from "lib/shared/ui/welcome/WelcomeHeader"
import { useSquadMembers } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import LoadingScreen from "screens/LoadingScreen"

export default function Screen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()

  const { data: members } = useSquadMembers(squadId)

  const toChar = (charId: string) => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main/recap",
      params: { charId, squadId }
    })
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <WelcomeHeader />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <List
          horizontal
          data={Object.keys(members)}
          separator={<Spacer x={40} />}
          keyExtractor={m => m}
          renderItem={({ item }) => (
            <PickCharacterCard charId={item} onPress={() => toChar(item)} />
          )}
        />
      </View>
    </Suspense>
  )
}
