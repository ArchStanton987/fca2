import { View } from "react-native"

import colors from "styles/colors"

import CheckBox from "./CheckBox/CheckBox"

type EquipInputProps = {
  isChecked: boolean
  isParentSelected: boolean
  onPress: () => void
}

export default function EquipInput(props: EquipInputProps) {
  const { isChecked, isParentSelected, onPress } = props
  return (
    <View style={{ justifyContent: "center", alignItems: "center", width: 25 }}>
      <CheckBox
        isChecked={isChecked}
        containerStyle={{ backgroundColor: isParentSelected ? colors.terColor : colors.primColor }}
        onPress={onPress}
      />
    </View>
  )
}
