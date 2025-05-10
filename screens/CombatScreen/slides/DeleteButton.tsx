import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import AntDesign from "@expo/vector-icons/AntDesign"

import colors from "styles/colors"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function DeleteButton({ size, disabled, ...rest }: NextButtonProps) {
  const mult = 0.5
  return (
    <TouchableOpacity
      style={{
        height: size ?? 36,
        width: size ?? 36,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: disabled ? colors.terColor : colors.secColor,
        borderRadius: size ? size * 0.5 : 36 * 0.5
      }}
      {...rest}
    >
      <AntDesign
        name="delete"
        size={size ? size * mult : 36 * mult}
        color={disabled ? colors.terColor : colors.secColor}
      />
    </TouchableOpacity>
  )
}
