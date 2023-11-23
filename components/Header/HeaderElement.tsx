import { View, ViewProps } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

type HeaderElementProps = ViewProps & {}

export default function HeaderElement(props: HeaderElementProps) {
  const { children, style, ...rest } = props
  return (
    <View
      style={[
        {
          backgroundColor: colors.terColor,
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
          paddingRight: 10,
          height: layout.headerHeight
        },
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
