import { ScrollView, StyleSheet } from "react-native"

import { router } from "expo-router"

import WelcomeHeader from "lib/shared/ui/welcome/WelcomeHeader"
import PickSquadCard from "lib/squad/ui/PickSquadCard"
import { useSubSquads } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import routes from "constants/routes"

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
  const squadsReq = useSubSquads()

  const toSquad = (squadId: string) =>
    router.push({ pathname: routes.charSelection, params: { squadId } })

  const toAdmin = (squadId: string) =>
    router.push({ pathname: routes.admin.index, params: { squadId } })

  return (
    <ScrollView style={styles.container}>
      <WelcomeHeader />
      <List
        data={Object.keys(squadsReq.data)}
        keyExtractor={id => id}
        separator={<Spacer y={20} />}
        renderItem={({ item }) => (
          <PickSquadCard
            onPress={() => toSquad(item)}
            onLongPress={() => toAdmin(item)}
            delayLongPress={2000}
            squadId={item}
          />
        )}
      />
    </ScrollView>
  )
}
