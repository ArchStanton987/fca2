import { ReactNode, useCallback } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useQueries, useQuery } from "@tanstack/react-query"
import { useSetCurrCharId } from "lib/character/character-store"
import CharInfo, { DbCharInfo } from "lib/character/info/CharInfo"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/exp-provider"
import PickCharacterCard from "lib/character/ui/PickCharacterCard/PickCharacterCard"
import { qkToPath, useSub } from "lib/shared/db/useSub"
import WelcomeHeader from "lib/shared/ui/welcome/WelcomeHeader"
import { getSquadOptions, useSquads } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import LoadingScreen from "screens/LoadingScreen"

function SubChar({ charId }: { charId: string }) {
  const infoCb = useCallback((payload: DbCharInfo) => new CharInfo(payload, charId), [charId])
  useSub(qkToPath(getCharInfoOptions(charId).queryKey), infoCb)
  useSub(qkToPath(getExpOptions(charId).queryKey))
  return null
}

function Loader({
  children,
  squadMembers,
  squadId
}: {
  children: ReactNode
  squadMembers: string[]
  squadId: string
}) {
  const playablesPending = useQueries({
    queries: squadMembers.map(id => getCharInfoOptions(id)),
    combine: res => res.some(q => q.isPending)
  })
  const { isPending } = useQuery(getSquadOptions(squadId))
  if (isPending || playablesPending) return <LoadingScreen />
  return children
}

export default function Screen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()

  const { data: squadMembers } = useSquads(squads => Object.keys(squads[squadId].members))
  const setCurrChar = useSetCurrCharId()

  const toChar = (charId: string) => {
    setCurrChar(charId)
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main",
      params: { charId, squadId }
    })
  }

  return (
    <>
      {squadMembers.map(id => (
        <SubChar key={id} charId={id} />
      ))}
      <Loader squadMembers={squadMembers} squadId={squadId}>
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
      </Loader>
    </>
  )
}
