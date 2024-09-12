import { View } from "react-native"

import { RootStackScreenProps } from "nav/nav.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import WithItemSeparator from "components/wrappers/WithItemSeparator"
import useDbSubscribe from "hooks/db/useDbSubscribe"

import dbKeys from "../../db/db-keys"
import styles from "./CharacterSelectionScreen.styles"

export default function CharacterSelectionScreen({
  navigation,
  route
}: RootStackScreenProps<"ChoixPerso">) {
  const { squadId } = route.params
  const squadMembers = useDbSubscribe(dbKeys.squad(squadId).members)
  const members = squadMembers
    ? Object.entries(squadMembers).map(([id, member]) => ({ ...member, id }))
    : []

  const toChar = (charId: string) => {
    navigation.push("Personnage", {
      screen: "Perso",
      params: { screen: "Résumé", params: { charId, squadId } }
    })
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
