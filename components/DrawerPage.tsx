import { Platform, StyleSheet, View, ViewProps } from "react-native"

import layout from "styles/layout"

const createStyles = (platform: Platform) =>
  StyleSheet.create({
    drawerPage: {
      flexDirection: "row",
      marginLeft: layout.drawerWidth + layout.globalPadding,
      marginTop: platform.OS === "web" ? 10 : 40
    }
  })

type DrawerPageProps = ViewProps

export default function DrawerPage({ children, style }: DrawerPageProps) {
  const platform = Platform
  const styles = createStyles(platform)
  return <View style={[styles.drawerPage, style]}>{children}</View>
}
