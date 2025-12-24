import React from "react"
import { StyleSheet, View } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primColor
  }
})

export default function ModalBody({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>
}
