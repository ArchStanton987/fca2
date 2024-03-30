import React from "react"
import { TouchableOpacity } from "react-native"

import { Entypo } from "@expo/vector-icons"

import colors from "styles/colors"

export default function MinusIcon({
  size = 45,
  onPress,
  color = colors.secColor
}: {
  size?: number
  onPress: () => void
  color?: string
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Entypo name="circle-with-minus" size={size} color={color} />
    </TouchableOpacity>
  )
}
