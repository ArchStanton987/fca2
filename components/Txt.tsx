import { Text, TextProps } from "react-native"

import colors from "styles/colors"
import typos from "styles/typos"

export default function Txt({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[{ fontFamily: typos.monofonto, color: colors.secColor }, style]} {...rest}>
      {children}
    </Text>
  )
}
