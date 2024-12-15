import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  drawerContainer: {
    width: layout.drawerWidth,
    backgroundColor: colors.primColor,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  navButtonText: {
    textAlign: "left",
    color: colors.quadColor,
    fontSize: 16
  },
  navButtonActive: {
    backgroundColor: colors.terColor
  },
  navButtonActiveText: {
    color: colors.secColor
  },
  badge: {}
})
export default styles
