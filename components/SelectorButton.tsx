import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import Txt from "./Txt"

type SelectorButtonProps = TouchableOpacityProps & {
  label: string
  isSelected: boolean
}

export default function SelectorButton({ label, isSelected, style, ...rest }: SelectorButtonProps) {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: isSelected ? colors.terColor : colors.primColor,
          borderWidth: 2,
          borderColor: colors.secColor,
          height: 40,
          width: 70,
          justifyContent: "center",
          alignItems: "center"
        },
        style
      ]}
      {...rest}
    >
      <Txt>{label}</Txt>
    </TouchableOpacity>
  )
}
