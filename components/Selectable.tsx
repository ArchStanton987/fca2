import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

type SelectableProps = TouchableOpacityProps & {
  isSelected: boolean
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "transparent"
  },
  selected: {
    backgroundColor: colors.terColor
  }
})

export default function Selectable(props: SelectableProps) {
  const { children, isSelected, style, ...rest } = props
  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.selected, style]} {...rest}>
      {children}
    </TouchableOpacity>
  )
}
