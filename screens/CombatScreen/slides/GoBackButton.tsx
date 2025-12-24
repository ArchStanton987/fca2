import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import PreviousIcon from "./PreviousIcon"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function GoBackButton({ size, disabled, ...rest }: NextButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...rest}>
      <PreviousIcon size={size} color={disabled ? colors.terColor : colors.secColor} />
    </TouchableOpacity>
  )
}
