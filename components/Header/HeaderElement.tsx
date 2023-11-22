import { View, ViewProps } from "react-native"

import colors from "styles/colors"

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
          flex: 1
        },
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
