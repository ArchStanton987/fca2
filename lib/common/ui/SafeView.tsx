import { ReactNode } from "react"
import { Platform, View } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import colors from "styles/colors"

export default function SafeView({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: Platform.OS === "web" ? insets.left + 3 : insets.left,
        paddingRight: Platform.OS === "web" ? insets.right + 3 : insets.right,
        paddingVertical: 5,
        backgroundColor: colors.primColor
      }}
    >
      {children}
    </View>
  )
}
