import React from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import Txt from "./Txt"

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.secColor,
    width: 50,
    height: 50,
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
