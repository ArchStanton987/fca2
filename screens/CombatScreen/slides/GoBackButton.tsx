import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import Ionicons from "@expo/vector-icons/Ionicons"

import colors from "styles/colors"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function GoBackButton({ size, disabled, ...rest }: NextButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...rest}>
      <Ionicons
        name="chevron-back-circle"
        size={size ?? 36}
        color={disabled ? colors.terColor : colors.secColor}
      />
    </TouchableOpacity>
  )
}
