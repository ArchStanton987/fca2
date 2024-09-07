import React from "react"
import { StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native"

import getStyles from "./CheckBox.styles"

type CheckBoxProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  checkedStyle?: StyleProp<ViewStyle>
  size?: number
  isChecked?: boolean
  color?: string
}

export default function CheckBox(props: CheckBoxProps) {
  const {
    size = 18,
    color,
    containerStyle,
    style,
    checkedStyle,
    isChecked = false,
    ...rest
  } = props

  const styles = getStyles(color)
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle, { width: size, height: size }]}
      {...rest}
    >
      <View
        style={[styles.content, style, isChecked && styles.checked, isChecked && checkedStyle]}
      />
    </TouchableOpacity>
  )
}
