import React from "react"
import { View } from "react-native"

import colors from "styles/colors"

export default function ModalBody({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1, padding: 10, backgroundColor: colors.primColor }}>{children}</View>
}
