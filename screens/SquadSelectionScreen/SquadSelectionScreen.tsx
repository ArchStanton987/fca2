import { ScrollView, TouchableOpacity } from "react-native"

import { router } from "expo-router"

import { getVersion } from "lib/common/utils/expo-utils"
import { useSubSquads } from "lib/squad/use-cases/sub-squad"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import LoadingScreen from "screens/LoadingScreen"
import { getDDMMYYYY } from "utils/date"

import styles from "./SquadSelectionScreen.styles"

export default function SquadSelectionScreen() {
  const squadsReq = useSubSquads()

  const toSquad = (squadId: string) =>
    router.push({ pathname: routes.charSelection, params: { squadId } })

  const onLongPress = (squadId: string) =>
    router.push({ pathname: routes.admin.index, params: { squadId } })

  if (squadsReq.isError) return <Txt>Erreur lors de la récupération des parties</Txt>
  if (squadsReq.isPending) return <LoadingScreen />

  const squadsArray = Object.entries(squadsReq.data).map(([id, value]) => ({ id, ...value }))

  return (
    <ScrollView style={styles.container}>
      <Txt style={styles.version}>{getVersion()}</Txt>
      <Spacer y={30} />
      <Txt style={styles.title}>
        {"<"}Fallout Companion App{">"}
      </Txt>
      <Spacer y={20} />
      <Txt style={styles.text}>Bienvenue !</Txt>
      <Spacer y={10} />
      <Txt style={styles.text}>Choisissez votre équipe</Txt>
      <Spacer y={20} />
      <List
        data={squadsArray}
        keyExtractor={s => s.id}
        separator={<Spacer y={20} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toSquad(item.id)}
            onLongPress={() => onLongPress(item.id)}
            delayLongPress={2000}
            style={styles.squadContainer}
          >
            <Txt style={styles.squadLabel}>{item.label}</Txt>
            <Txt style={styles.squadLabel}>{getDDMMYYYY(item.datetime)}</Txt>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  )
}
