import { Platform, StyleSheet, View, ViewProps } from "react-native"

import layout from "styles/layout"

const createStyles = () =>
  StyleSheet.create({
    tabPage: {
      flex: 1,
      flexDirection: "row",
      marginTop: Platform.OS === "web" ? 0 : 20 + layout.globalPadding
    }
  })

type DrawerPageProps = ViewProps

export default function TabPage({ children, style }: DrawerPageProps) {
  const styles = createStyles()
  return <View style={[styles.tabPage, style]}>{children}</View>
}
