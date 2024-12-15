import { Platform, StyleSheet } from "react-native"

import layout from "./layout"

const { headerHeight, globalPadding } = layout

const styles = StyleSheet.create({
  drawerLayout: {
    flex: 1,
    flexDirection: "row",
    marginTop: Platform.OS === "web" ? globalPadding : headerHeight + globalPadding,
    marginBottom: globalPadding + 5
  }
})

export default styles
