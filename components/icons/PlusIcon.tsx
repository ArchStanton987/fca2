import React from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import { Entypo } from "@expo/vector-icons"

import colors from "styles/colors"

type PlusIconProps = TouchableOpacityProps & {
  size?: number
  color?: string
}
export default function PlusIcon({
  size = 45,
  onPress,
  color = colors.secColor,
  ...rest
}: PlusIconProps) {
  return (
    <TouchableOpacity {...rest}>
      <Entypo name="circle-with-plus" size={size} color={color} />
    </TouchableOpacity>
  )
}
