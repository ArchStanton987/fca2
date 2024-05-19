import { View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import WithItemSeparator from "components/wrappers/WithItemSeparator"
import routes from "constants/routes"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import { CharacterSelectionScreenParams } from "screens/CharacterSelectionScreen/CharacterSelectionScreen.params"
import { SearchParams } from "screens/ScreenParams"

import dbKeys from "../../db/db-keys"
import styles from "./CharacterSelectionScreen.styles"

export default function CharacterSelectionScreen() {
  const router = useRouter()
  const { squadId } = useLocalSearchParams() as SearchParams<CharacterSelectionScreenParams>
  const squadMembers = useDbSubscribe(dbKeys.squad(squadId).members)
  const members = squadMembers
    ? Object.entries(squadMembers).map(([id, member]) => ({ ...member, id }))
    : []

  const toChar = (charId: string) => {
    router.push({ pathname: routes.main.index, params: { charId, squadId } })
  }

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
        <WithItemSeparator ItemSeparatorComponent={<Spacer x={40} />}>
          {members.map(member => (
            <RevertColorsPressable
              key={member.id}
              style={styles.charButton}
              onPress={() => toChar(member.id)}
            >
              <Txt>
                {member.firstname} {member.lastname}
              </Txt>
              <Spacer y={15} />
              <Txt>exp: {member.exp}</Txt>
            </RevertColorsPressable>
          ))}
        </WithItemSeparator>
      </View>
    </>
  )
}
