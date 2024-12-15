import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

type SelectableProps = {
  children: React.ReactNode
  isSelected: boolean
  buttonProps?: TouchableOpacityProps
  onPress: () => void
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingVertical: 8
  },
  selected: {
    backgroundColor: colors.terColor
  }
})

export default function Selectable(props: SelectableProps) {
  const { children, isSelected, buttonProps, onPress } = props
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={onPress}
      {...buttonProps}
    >
      {children}
    </TouchableOpacity>
  )
}
