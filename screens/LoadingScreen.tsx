import React from "react"
import { ActivityIndicator, View } from "react-native"

import colors from "styles/colors"

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.secColor} />
    </View>
  )
}
