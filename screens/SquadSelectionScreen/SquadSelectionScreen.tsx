import { View } from "react-native"

import database from "config/firebase"
import { onValue, ref } from "firebase/database"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"

import styles from "./SquadSelectionScreen.styles"

interface SquadDbType {
  id: string
  label: string
  members: string[]
  datetime: string
}

export default function SquadSelectionScreen() {
  let squads

  const squadsRef = ref(database, "squads")
  onValue(squadsRef, snapshot => {
    squads = snapshot.val()
  })

  const squadsArray = Object.entries(squads).map(([key, value]) => ({
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
