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

export default function CharacterSelection() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: members } = useSquadMembers(squadId)

  const setChar = useSetCurrCharId()

  const toChar = (charId: string) => {
    setChar(charId)
    router.push({ pathname: routes.main.index, params: { charId } })
  }

  const squadMembers = Object.keys(members)
  useSubPlayablesCharInfo(squadMembers)
  useSubPlayablesExp(squadMembers)

  return (
    <>
      <Spacer y={30} />
      <WelcomeHeader />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <List
          horizontal
          data={squadMembers}
          keyExtractor={m => m}
          renderItem={({ item }) => (
            <PickCharacterCard charId={item} onPress={() => toChar(item)} />
          )}
        />
      </View>
    </>
  )
}
