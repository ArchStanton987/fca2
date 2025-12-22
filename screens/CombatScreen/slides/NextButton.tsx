import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import NextIcon from "./NextIcon"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function NextButton({ size, disabled, ...rest }: NextButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...rest}>
      <NextIcon size={size} color={disabled ? colors.terColor : colors.secColor} />
    </TouchableOpacity>
  )
}
