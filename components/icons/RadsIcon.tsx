import * as React from "react"

import Svg, { Circle, G, Path, Use } from "react-native-svg"

type SvgIconProps = {
  size: number
  color: string
}

function RadsICon({ size, color }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="-300 -300 600 600">
      <G
        fill={color}
        style={{
          fill: color,
          fillOpacity: 1
        }}
      >
        <Circle r={50} />
        <Path id="a" d="M75 0a75 75 0 0 0-37.5-64.952L125-216.506A250 250 0 0 1 250 0z" />
        <Use xlinkHref="#a" transform="rotate(120)" />
        <Use xlinkHref="#a" transform="rotate(240)" />
      </G>
    </Svg>
  )
}
export default RadsICon
