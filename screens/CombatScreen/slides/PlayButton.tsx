import { TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import PlayIcon from "./PlayIcon"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

export default function PlayButton({ size, disabled, ...rest }: NextButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} {...rest}>
      <PlayIcon size={size} color={disabled ? colors.terColor : colors.secColor} />
    </TouchableOpacity>
  )
}
