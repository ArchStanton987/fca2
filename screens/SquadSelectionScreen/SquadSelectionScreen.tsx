import { View } from "react-native"

import Txt from "components/Txt"

import styles from "./SquadSelectionScreen.styles"

export default function SquadSelectionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Txt style={styles.title}>Fallout Companion App</Txt>
        <Txt style={styles.subtitle}>Bienvenue !</Txt>
        <Txt style={styles.subtitle}>Choisissez votre équipe</Txt>
      </View>
    </View>
  )
}
