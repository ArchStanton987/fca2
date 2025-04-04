import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import colors from "styles/colors"

type NextButtonProps = TouchableOpacityProps & {
  size?: number
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 200,
    backgroundColor: colors.secColor,
    justifyContent: "center",
    alignItems: "center"
  },
  disabled: {
    backgroundColor: colors.terColor
  }
})

export default function NextButton({ size, disabled, ...rest }: NextButtonProps) {
  const finalSize = size ?? 36
  const iconSize = finalSize * 0.8
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
        { height: finalSize, width: finalSize }
      ]}
      {...rest}
    >
      <MaterialIcons name="navigate-next" size={iconSize} color="black" />
    </TouchableOpacity>
  )
}
