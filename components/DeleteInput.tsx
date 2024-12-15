import { StyleProp, TouchableOpacity, ViewStyle } from "react-native"

import { AntDesign } from "@expo/vector-icons"

import colors from "styles/colors"

type DeleteInputProps = {
  isSelected: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export default function DeleteInput(props: DeleteInputProps) {
  const { isSelected, onPress, style } = props
  return (
    <TouchableOpacity
      style={[{ justifyContent: "center", alignItems: "flex-end", width: 32 }, style]}
      onPress={onPress}
      disabled={!isSelected}
    >
      {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
    </TouchableOpacity>
  )
}
