import React from "react"
import { StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native"

import styles from "./CheckBox.styles"

type CheckBoxProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  checkedStyle?: StyleProp<ViewStyle>
  size?: number
  isChecked?: boolean
}

export default function CheckBox(props: CheckBoxProps) {
  const { size = 18, containerStyle, style, checkedStyle, isChecked = false, ...rest } = props
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
