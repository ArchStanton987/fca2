import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import colors from "styles/colors"

import Txt from "./Txt"

type ListItemSelectableProps = TouchableOpacityProps & {
  label?: string
  isSelected?: boolean
}

const styles = StyleSheet.create({
  actionTypeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5
  },
  selected: {
    backgroundColor: colors.terColor
  },
  selectedText: {
    color: colors.secColor
  },
  disabled: {},
  disabledText: {
    color: colors.terColor
  }
})

export default function ListItemSelectable({
  label,
  style,
  isSelected,
  disabled,
  children,
  ...rest
}: ListItemSelectableProps) {
  return (
    <TouchableOpacity
      style={[
        styles.actionTypeContainer,
        style,
        isSelected && styles.selected,
        disabled && styles.disabled
      ]}
      disabled={disabled}
      {...rest}
    >
      {label ? (
        <Txt style={[isSelected && styles.selectedText, disabled && styles.disabledText]}>
          {label}
        </Txt>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
