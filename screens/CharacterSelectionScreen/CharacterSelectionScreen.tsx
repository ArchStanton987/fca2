import { TouchableOpacity, View } from "react-native"

import { router } from "expo-router"

import { useQueries } from "@tanstack/react-query"
import { useSetCurrCharId } from "lib/character/character-store"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/progress-provider"
import { useMultiSub } from "lib/shared/db/useSub"
import { useSquad } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import LoadingScreen from "screens/LoadingScreen"

import styles from "./CharacterSelectionScreen.styles"

export default function CharacterSelectionScreen() {
  const squad = useSquad()

  const setChar = useSetCurrCharId()

  const toChar = (charId: string) => {
    setChar(charId)
    router.push({ pathname: routes.main.index, params: { charId } })
  }

  const squadMembers = Object.keys(squad.members)

  const expOptions = squadMembers.map(c => getExpOptions(c))
  useMultiSub(expOptions.map(o => ({ path: o.queryKey.join("/") })))

  const charOptions = squadMembers.map(m => getCharInfoOptions(m))
  useMultiSub(charOptions.map(o => ({ path: o.queryKey.join("/") })))

  const expReq = useQueries({
    queries: expOptions,
    combine: queries => ({
      isPending: queries.some(q => q.isPending),
      isError: queries.some(q => q.isError),
      data: queries.map(q => q.data)
    })
  })

  const membersReq = useQueries({
    queries: charOptions,
    combine: res => ({
      isPending: res.some(query => query.isPending),
      isError: res.some(query => query.isError),
      data: res.map(query => query.data)
    })
  })

  const data = squadMembers.map((id, i) => {
    const firstname = membersReq.data[i]?.firstname ?? ""
    const lastname = membersReq.data[i]?.lastname ?? ""
    const exp = expReq.data[i] ?? 0
    return { id, firstname, lastname, exp }
  })

  if (expReq.isPending || membersReq.isPending) return <LoadingScreen />
  if (expReq.isError || membersReq.isError)
    return (
      <View>
        <Txt>Erreur lors de la récupération des personnages</Txt>
      </View>
    )

  return (
    <>
      <Spacer y={30} />
      <Txt style={styles.title}>
        {"<"}Fallout Companion App{">"}
      </Txt>
      <Spacer y={20} />
      <Txt style={styles.text}>Bienvenue !</Txt>
      <Spacer y={10} />
      <Txt style={styles.text}>Choisissez votre personnage</Txt>
      <Spacer y={30} />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <List
          horizontal
          data={data}
          keyExtractor={c => c.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.charButton} onPress={() => toChar(item.id)}>
              <Txt>
                {item.firstname} {item.lastname}
              </Txt>
              <Spacer y={15} />
              <Txt>exp: {item.exp}</Txt>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  )
}
