import { View, ViewProps } from "react-native"

import styles from "./Line.styles"

type SmallLineProps = ViewProps & {
  top?: boolean
  left?: boolean
  right?: boolean
  bottom?: boolean
}

export default function SmallLine(props: SmallLineProps) {
  const { top, left, right, bottom, style, ...rest } = props
  return (
    <View
      style={[
        styles.bar,
        top && styles.top,
        left && styles.left,
        right && styles.right,
        bottom && styles.bottom,
        style
      ]}
      {...rest}
    />
  )
}
