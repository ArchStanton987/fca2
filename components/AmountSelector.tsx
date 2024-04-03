import React from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import Txt from "./Txt"

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.secColor,
    width: 40,
    height: 40,
    padding: 0,
    backgroundColor: colors.primColor
  },
  isSelected: {
    backgroundColor: colors.terColor
  }
})

type AmountSelectorProps = TouchableOpacityProps & {
  value: number | string
  isSelected: boolean
}

export default function AmountSelector({
  value,
  isSelected = false,
  ...rest
}: AmountSelectorProps) {
  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.isSelected]} {...rest}>
      <Txt>{value}</Txt>
    </TouchableOpacity>
  )
}
