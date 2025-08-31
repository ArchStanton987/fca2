import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import AntDesign from "@expo/vector-icons/AntDesign"

import colors from "styles/colors"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function PlayButton({ size, disabled, ...rest }: NextButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...rest}>
      <AntDesign
        name="playcircleo"
        size={size ?? 36}
        color={disabled ? colors.terColor : colors.secColor}
      />
    </TouchableOpacity>
  )
}
