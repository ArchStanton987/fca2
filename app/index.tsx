import { ScrollView, StyleSheet } from "react-native"

import { router } from "expo-router"

import WelcomeHeader from "lib/shared/ui/welcome/WelcomeHeader"
import PickSquadCard from "lib/squad/ui/PickSquadCard"
import { useSubSquads } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  squadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    padding: 10,
    marginHorizontal: 50
  },
  squadLabel: {
    textAlign: "center"
  }
})

export default function SquadSelection() {
  const { data: squads, isPending, isError } = useSubSquads()

  const toSquad = (squadId: string) =>
    router.push({ pathname: "/squad/[squadId]", params: { squadId } })

  const toAdmin = (squadId: string) =>
    router.push({ pathname: "/squad/[squadId]/admin/datetime", params: { squadId } })

  if (isError) return <Txt>Erreur lors de la récupération des parties</Txt>
  if (isPending) return <LoadingScreen />

  const squadsList = Object.entries(squads).map(([id, value]) => ({
    id,
    label: value.label,
    datetime: value.datetime
  }))

  return (
    <ScrollView style={styles.container}>
      <WelcomeHeader />
      <List
        data={squadsList}
        keyExtractor={e => e.id}
        separator={<Spacer y={20} />}
        renderItem={({ item }) => (
          <PickSquadCard
            onPress={() => toSquad(item.id)}
            onLongPress={() => toAdmin(item.id)}
            delayLongPress={2000}
            label={item.label}
            datetime={item.datetime}
          />
        )}
      />
    </ScrollView>
  )
}
