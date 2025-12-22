import React from "react"

import Svg, { Circle, Path, Rect } from "react-native-svg"

import colors from "styles/colors"

type NextIconProps = {
  size?: number
  color?: string
}

export default function NextIcon({ size = 48, color = colors.secColor }: NextIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="50" r="46" stroke={color} strokeWidth="6" />
      <Path d="M28 32 L48 50 L28 68 Z" fill={color} />
      <Path d="M48 32 L68 50 L48 68 Z" fill={color} />
      <Rect x="72" y="32" width="6" height="36" fill={color} />
    </Svg>
  )
}
