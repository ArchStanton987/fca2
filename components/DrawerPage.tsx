import { Platform, StyleSheet, View, ViewProps } from "react-native"

import layout from "styles/layout"

const createStyles = (platform: Platform) =>
  StyleSheet.create({
    drawerPage: {
      flex: 1,
      flexDirection: "row",
      marginLeft: layout.drawerWidth + layout.globalPadding,
      marginTop:
        platform.OS === "web" ? layout.globalPadding : layout.globalPadding + layout.headerHeight
    }
  })

type DrawerPageProps = ViewProps

export default function DrawerPage({ children, style }: DrawerPageProps) {
  const platform = Platform
  const styles = createStyles(platform)
  return <View style={[styles.drawerPage, style]}>{children}</View>
}
