import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSetCurrCharId } from "lib/character/character-store"
import { useSubPlayablesCharInfo } from "lib/character/info/info-provider"
import { useSubPlayablesExp } from "lib/character/progress/exp-provider"
import PickCharacterCard from "lib/character/ui/PickCharacterCard/PickCharacterCard"
import WelcomeHeader from "lib/shared/ui/welcome/WelcomeHeader"
import { useSquadMembers } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import LoadingScreen from "screens/LoadingScreen"

function Screen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: members } = useSquadMembers(squadId)

  const setChar = useSetCurrCharId()

  const toChar = (charId: string) => {
    setChar(charId)
    router.push({ pathname: routes.main.index, params: { charId } })
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
