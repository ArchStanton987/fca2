import { ScrollView } from "react-native"

import { useRouter } from "expo-router"

import useCases from "lib/common/use-cases"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import WithItemSeparator from "components/wrappers/WithItemSeparator"
import routes from "constants/routes"
import useRtdbSub from "hooks/db/useRtdbSub"
import { getDDMMYYYY } from "utils/date"

import styles from "./SquadSelectionScreen.styles"

export default function SquadSelectionScreen() {
  const router = useRouter()
  // const squadsObj: Record<string, DbSquad> | undefined = useDbSubscribe(dbKeys.squads)
  const squadsObj = useRtdbSub(useCases.squad.getAll())
  const squadsArray = squadsObj
    ? Object.entries(squadsObj).map(([id, squad]) => ({ ...squad, id }))
    : []

  const toSquad = (squadId: string) =>
    router.push({ pathname: routes.charSelection, params: { squadId } })

  const onLongPress = (squadId: string) =>
    router.push({ pathname: routes.admin.index, params: { squadId } })

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
      <WithItemSeparator ItemSeparatorComponent={<Spacer y={20} />}>
        {squadsArray.map(squad => (
          <RevertColorsPressable
            key={squad.id}
            onPress={() => toSquad(squad.id)}
            onLongPress={() => onLongPress(squad.id)}
            delayLongPress={3000}
            style={styles.squadContainer}
          >
            <Txt style={styles.squadLabel}>{squad.label}</Txt>
            <Txt style={styles.squadLabel}>{getDDMMYYYY(new Date(squad.datetime))}</Txt>
          </RevertColorsPressable>
        ))}
      </WithItemSeparator>
    </ScrollView>
  )
}
