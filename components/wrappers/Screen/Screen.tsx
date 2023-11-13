import React from "react"
import { View, ViewProps } from "react-native"

import styles from "./Screen.styles"

export default function Screen({ children }: ViewProps) {
  return <View style={styles.container}>{children}</View>
}
