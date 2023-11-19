import { TouchableHighlight, TouchableHighlightProps } from "react-native"

import colors from "styles/colors"

type HeaderElementProps = TouchableHighlightProps & {}

export default function HeaderElement(props: HeaderElementProps) {
  const { onPress, children, style, ...rest } = props
  return (
    <TouchableHighlight
      style={[
        {
          backgroundColor: colors.terColor,
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
          flex: 1
        },
        style
      ]}
      disabled={!onPress}
      {...rest}
    >
      {children}
    </TouchableHighlight>
  )
}
