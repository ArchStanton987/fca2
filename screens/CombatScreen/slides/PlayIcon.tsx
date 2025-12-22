import React from "react"

import Svg, { Circle, Path } from "react-native-svg"

import colors from "styles/colors"

type PlayIconProps = {
  size?: number
  color?: string
}

export default function PlayIcon({ size = 48, color = colors.secColor }: PlayIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="50" r="46" stroke={color} strokeWidth="6" />
      <Path d="M42 32 L72 50 L42 68 Z" fill={color} />
    </Svg>
  )
}
