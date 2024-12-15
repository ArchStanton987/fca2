import { StyleProp, View, ViewStyle } from "react-native"

import Txt from "./Txt"

type ListLabelProps = {
  label: string
  style?: StyleProp<ViewStyle>
}

export default function ListLabel({ label, style }: ListLabelProps) {
  return (
    <View style={[{ flex: 1 }, style]}>
      <Txt>{label}</Txt>
    </View>
  )
}
