import React from "react"
import { View } from "react-native"

export default function ModalBody({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1, padding: 10 }}>{children}</View>
}
