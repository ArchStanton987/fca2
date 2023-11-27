import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"
import typos from "styles/typos"

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    marginVertical: 40,
    marginHorizontal: 0,
    backgroundColor: colors.primColor,
    borderWidth: 0,
    borderTopWidth: 1,
    // HACK it seems that a glitch create a border on the right, so we need to set it to 0
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: colors.secColor,
    width: layout.drawerWidth
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
