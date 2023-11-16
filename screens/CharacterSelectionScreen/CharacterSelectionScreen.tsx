import { View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import WithItemSeparator from "components/wrappers/WithItemSeparator"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import { SquadMember } from "models/squad/squad-types"
import { CharacterSelectionScreenParams } from "screens/CharacterSelectionScreen/CharacterSelectionScreen.params"
import { SearchParams } from "screens/ScreenParams"

import dbKeys from "../../db/db-keys"
import { DbObj } from "../../db/db-types"
import styles from "./CharacterSelectionScreen.styles"

export default function CharacterSelectionScreen() {
  const router = useRouter()
  const { squadId } = useLocalSearchParams() as SearchParams<CharacterSelectionScreenParams>
  const squadMembers: DbObj<SquadMember> = useDbSubscribe(dbKeys.squadMembers(squadId))
  const members = Object.values(squadMembers || {})

  const toChar = (charId: string) =>
    router.push({ pathname: `/character/[characterId]`, params: { characterId: charId } })

  return (
    <>
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
