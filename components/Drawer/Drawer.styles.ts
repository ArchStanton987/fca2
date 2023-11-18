import { StyleSheet } from "react-native"

import colors from "styles/colors"
import typos from "styles/typos"

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    marginVertical: 40,
    marginHorizontal: 0,
    left: 0,
    backgroundColor: colors.primColor,
    borderWidth: 1,
    // HACK it seems that a glitch create a border on the right, so we need to set it to 0
    borderRightWidth: 0,
    borderTopColor: colors.secColor,
    width: 180
  },
  fcaContainer: {
    borderWidth: 0,
    padding: 0
  },
  fca: {
    color: colors.secColor,
    fontFamily: typos.jukebox,
    fontSize: 38,
    textAlign: "center"
  },
  navButton: {
    borderWidth: 0,
    borderRadius: 0
  },
  navButtonText: {
    fontFamily: typos.monofonto,
    color: colors.secColor,
    fontSize: 16
  }
})
export default styles
