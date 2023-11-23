import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  container: {
    marginLeft: layout.drawerWidth + layout.globalPadding,
    marginTop: layout.globalPadding,
    padding: 10,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.secColor
  },
  attributeRow: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  }
})
export default styles
