import { StyleSheet, View, ViewProps } from "react-native"

import layout from "styles/layout"

const styles = StyleSheet.create({
  drawerPage: {
    marginLeft: layout.drawerWidth + layout.globalPadding,
    marginTop: layout.globalPadding
  }
})

type DrawerPageProps = ViewProps

export default function DrawerPage({ children, style }: DrawerPageProps) {
  return <View style={[styles.drawerPage, style]}>{children}</View>
}
