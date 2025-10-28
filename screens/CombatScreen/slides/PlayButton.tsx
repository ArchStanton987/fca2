import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

import colors from "styles/colors"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function PlayButton({ size, disabled, ...rest }: NextButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...rest}>
      <FontAwesome6
        name="circle-play"
        size={size ?? 36}
        color={disabled ? colors.terColor : colors.secColor}
      />
    </TouchableOpacity>
  )
}
