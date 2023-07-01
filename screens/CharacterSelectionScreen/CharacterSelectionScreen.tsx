import { View } from "react-native"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"

import db from "../../db/fca-back-23-01-30 copy.json"
import styles from "./CharacterSelectionScreen.styles"

export default function CharacterSelectionScreen() {
  const squadsArray = Object.entries(db.squads).map(([key, value]) => ({
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
      <Txt style={styles.text}>Choisissez votre équipe</Txt>
      <Spacer y={20} />
      {squadsArray.map(squad => (
        <RevertColorPressable key={squad.label}>
          <Txt>{squad.label}</Txt>
        </RevertColorPressable>
      ))}
    </View>
  )
}
