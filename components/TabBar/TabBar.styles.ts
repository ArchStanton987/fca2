import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"
import typos from "styles/typos"

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: layout.tabBarHeight
  },
  fcaContainer: {
    width: layout.drawerWidth,
    borderWidth: 0,
    padding: 0
  },
  fca: {
    color: colors.secColor,
    fontFamily: typos.jukebox,
    fontSize: 36,
    textAlign: "center"
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0,
    height: layout.tabBarHeight
  },
  listStyle: {
    alignItems: "center",
    // used for web
    flex: 1
  },
  label: {
    fontFamily: typos.monofonto,
    color: colors.secColor
  },
  tabBarItem: {
    backgroundColor: colors.primColor,
    borderWidth: 1,
    borderColor: colors.secColor,
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    height: 35,
    justifyContent: "center"
  },
  tabBarItemActive: {
    backgroundColor: colors.secColor,
    borderColor: colors.secColor
  },
  labelActive: {
    color: colors.primColor
  },
  horizLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.secColor
  }
})
export default styles
