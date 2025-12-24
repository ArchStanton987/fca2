import React from "react"

import Svg, { Circle, Path, Rect } from "react-native-svg"

import colors from "styles/colors"

type PreviousIconProps = {
  size?: number
  color?: string
}

export default function PreviousIcon({ size = 48, color = colors.secColor }: PreviousIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="50" r="46" stroke={color} strokeWidth="6" />
      <Rect x="22" y="32" width="6" height="36" fill={color} />
      <Path d="M72 32 L52 50 L72 68 Z" fill={color} />
      <Path d="M52 32 L32 50 L52 68 Z" fill={color} />
    </Svg>
  )
}
