import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import colors from "styles/colors"

import Txt from "./Txt"

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.secColor,
    width: 45,
    height: 45,
    backgroundColor: colors.primColor
  },
  isSelected: {
    backgroundColor: colors.terColor
  }
})

type AmountSelectorProps = {
  value: number | string
  isSelected: boolean
  onPress: () => void
}

export default function AmountSelector({
  value,
  isSelected = false,
  onPress
}: AmountSelectorProps) {
  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.isSelected]} onPress={onPress}>
      <Txt>{value}</Txt>
    </TouchableOpacity>
  )
}
