import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import Entypo from "@expo/vector-icons/Entypo"

import colors from "styles/colors"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100
  },
  disabled: {
    backgroundColor: colors.terColor
  }
})

export default function NextButton({ size, disabled, ...rest }: NextButtonProps) {
  const finalSize = size ?? 36
  return (
    <TouchableOpacity style={[styles.container, disabled && styles.disabled]} {...rest}>
      <Entypo
        name="chevron-with-circle-right"
        size={finalSize}
        color={disabled ? "black" : colors.secColor}
      />
    </TouchableOpacity>
  )
}
