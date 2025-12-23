import { ReactNode } from "react"
import { View } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import colors from "styles/colors"

export default function SafeView({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingVertical: 5,
        backgroundColor: colors.primColor
      }}
    >
      {children}
    </View>
  )
}
