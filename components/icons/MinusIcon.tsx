import React from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import { Entypo } from "@expo/vector-icons"

import colors from "styles/colors"

type MinusIconProps = TouchableOpacityProps & {
  size?: number
  color?: string
}

export default function MinusIcon({ size = 45, color = colors.secColor, ...rest }: MinusIconProps) {
  return (
    <TouchableOpacity {...rest}>
      <Entypo name="circle-with-minus" size={size} color={color} />
    </TouchableOpacity>
  )
}
