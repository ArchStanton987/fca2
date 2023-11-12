import { ScrollView } from "react-native"

import { useRouter } from "expo-router"

import { DbObj } from "db/db-types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import Bttn from "components/wrappers/Bttn/Bttn"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import { Squad } from "models/squad/squad-types"
import { getDDMMYYYY } from "utils/date"

import dbKeys from "../../db/db-keys"
import styles from "./SquadSelectionScreen.styles"

export default function SquadSelectionScreen() {
  const router = useRouter()
  const squadsObj: DbObj<Squad> = useDbSubscribe(dbKeys.squads)
  const squadsArray = Object.values(squadsObj || {})

  const toSquad = (squadId: string) =>
    router.push({ pathname: `/squad/[squadId]`, params: { squadId } })

  return (
    <ScrollView style={styles.container}>
      <Txt style={styles.title}>
        {"<"}Fallout Companion App{">"}
      </Txt>
      <Spacer y={20} />
      <Txt style={styles.text}>Bienvenue !</Txt>
      <Spacer y={10} />
      <Txt style={styles.text}>Choisissez votre équipe</Txt>
      <Spacer y={20} />
      {squadsArray.map(squad => (
        <Bttn onPress={() => toSquad(squad.id)} key={squad.id} style={styles.squadContainer}>
          <Txt style={styles.squadLabel}>{squad.label}</Txt>
          <Txt style={styles.squadLabel}>{getDDMMYYYY(new Date(squad.datetime * 1000))}</Txt>
        </Bttn>
      ))}
    </ScrollView>
  )
}
