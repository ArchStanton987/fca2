import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"
import typos from "styles/typos"

const styles = StyleSheet.create({
  drawerContainer: {
    top: layout.headerHeight + 20,
    width: layout.drawerWidth,
    height: layout.drawerHeight,
    position: "absolute",
    left: 10,
    zIndex: 1,
    backgroundColor: colors.primColor,
    borderWidth: 0,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: colors.secColor
  },
  fcaContainer: {
    borderWidth: 0,
    padding: 0
  },
  fca: {
    color: colors.secColor,
    fontFamily: typos.jukebox,
    fontSize: 32,
    textAlign: "center"
  },
  navButton: {
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  navButtonText: {
    fontFamily: typos.monofonto,
    color: colors.terColor,
    fontSize: 16
  },
  navButtonActive: {
    backgroundColor: colors.terColor
  },
  navButtonActiveText: {
    color: colors.secColor
  }
})
export default styles
