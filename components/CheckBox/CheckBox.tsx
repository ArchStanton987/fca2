import React from "react"
import { Pressable, PressableProps, StyleProp, View, ViewStyle } from "react-native"

import styles from "./CheckBox.styles"

type CheckBoxProps = PressableProps & {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  checkedStyle?: StyleProp<ViewStyle>
  size?: number
  isChecked?: boolean
}

export default function CheckBox(props: CheckBoxProps) {
  const { size = 40, containerStyle, style, checkedStyle, isChecked = false, ...rest } = props
  return (
    <Pressable style={[styles.container, containerStyle, { width: size, height: size }]} {...rest}>
      <View
        style={[styles.content, style, isChecked && styles.checked, isChecked && checkedStyle]}
      />
    </Pressable>
  )
}
