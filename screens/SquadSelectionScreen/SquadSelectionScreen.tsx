import { View } from "react-native"
import { useLocalSearchParams } from "expo-router"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"

import db from "../../db/fca-back-23-01-30 copy.json"
import styles from "./SquadSelectionScreen.styles"

export default function SquadSelectionScreen() {
  const { id } = useLocalSearchParams()
  const squads = db.squads
  const squad = Object.entries(squads[id]).map(([key, value]) => ({
    id: key,
    ...value
  }))

  return (
    <View style={styles.container}>
      <Txt style={styles.title}>
        {"<"}Fallout Companion App{">"}
      </Txt>
      <Spacer y={20} />
      <Txt style={styles.text}>Bienvenue !</Txt>
      <Spacer y={10} />
      <Txt style={styles.text}>Choisissez votre personnage</Txt>
      <Spacer y={20} />
      {squad.members.map(member => (
        <RevertColorPressable key={member.id}>
          <Txt>{member.firstname}</Txt>
          <Txt>{member.lastname}</Txt>
          <Txt>{member.exp}</Txt>
        </RevertColorPressable>
      ))}
    </View>
  )
}
