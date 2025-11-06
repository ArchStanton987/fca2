import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSubPlayablesCharInfo } from "lib/character/info/info-provider"
import { useSubPlayablesExp } from "lib/character/progress/exp-provider"
import PickCharacterCard from "lib/character/ui/PickCharacterCard/PickCharacterCard"
import WelcomeHeader from "lib/shared/ui/welcome/WelcomeHeader"
import { useSquadMembers } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import LoadingScreen from "screens/LoadingScreen"

function Screen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: members } = useSquadMembers(squadId)

  const toChar = (charId: string) => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main/recap",
      params: { charId, squadId }
    })
  }

  const squadMembers = Object.keys(members)

  return (
    <>
      <WelcomeHeader />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <List
          horizontal
          data={squadMembers}
          separator={<Spacer x={40} />}
          keyExtractor={m => m}
          renderItem={({ item }) => (
            <PickCharacterCard charId={item} onPress={() => toChar(item)} />
          )}
        />
      </View>
    </>
  )
}

export default function PickCharacterScreen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: members } = useSquadMembers(squadId)
  const squadMembers = Object.keys(members)
  const charInfoReq = useSubPlayablesCharInfo(squadMembers)
  const expReq = useSubPlayablesExp(squadMembers)
  if (charInfoReq.some(r => r.isPending) || expReq.some(r => r.isPending)) return <LoadingScreen />
  return <Screen />
}
