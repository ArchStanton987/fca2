import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native"

import colors from "styles/colors"

type LoaderProps = {
  style?: StyleProp<ViewStyle>
  size?: "large" | "small"
}

export default function Loader({ size, style }: LoaderProps) {
  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      <ActivityIndicator size={size} color={colors.secColor} />
    </View>
  )
}
