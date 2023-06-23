import { Text, View } from "react-native"

import styles from "./SquadSelectionScreen.styles"

export default function SquadSelectionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Fallout Companion App</Text>
        <Text style={styles.subtitle}>Bienvenue !</Text>
        <Text style={styles.subtitle}>Choisissez votre équipe</Text>
      </View>
    </View>
  )
}
