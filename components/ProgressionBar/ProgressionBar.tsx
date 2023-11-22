import React from "react"
import { StyleProp, View, ViewStyle } from "react-native"

import colors from "styles/colors"

type ProgressionBarProps = {
  value: number
  max?: number
  min?: number
  height?: number
  width?: number
  borderWidth?: number
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  horizontal?: boolean
}

export default function ProgressionBar(props: ProgressionBarProps) {
  const {
    max = 100,
    min = 0,
    value,
    height = 13,
    width = 50,
    borderWidth = 1,
    containerStyle,
    style,
    horizontal = true
  } = props

  const span = max - min
  const ratio = width / span
  const unit = value - min
  const innerWidth = Math.min(unit * ratio, max - borderWidth)

  return (
    <View
      style={[
        {
          flexDirection: "row",
          height,
          width,
          backgroundColor: "transparent",
          borderColor: colors.secColor,
          borderWidth,
          transform: [{ rotateX: horizontal ? "0deg" : "90deg" }]
        },
        containerStyle
      ]}
    >
      <View
        style={[
          {
            backgroundColor: colors.secColor,
            height: height - 2 * borderWidth,
            width: innerWidth
          },
          style
        ]}
      />
    </View>
  )
}
