import { StyleSheet } from "react-native"

import colors from "styles/colors"
import typos from "styles/typos"

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: colors.primColor,
    borderTopWidth: 0,
    height: 40
  },
  label: {
    fontFamily: typos.monofonto,
    color: colors.secColor
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5
  },
  tabBarItem: {
    backgroundColor: colors.primColor,
    borderWidth: 1,
    borderColor: colors.primColor,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center"
  },
  tabBarItemActive: {
    backgroundColor: colors.terColor,
    borderColor: colors.secColor
  },
  horizLine: {
    position: "absolute",
    left: 0,
    top: 19.5,
    height: 1,
    backgroundColor: colors.secColor,
    width: "100%"
  }
})
export default styles
