import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  default: {
    color: colors.secColor
  },
  shiny: {
    backgroundColor: colors.secColor,
    color: colors.primColor,
    paddingHorizontal: 6
  },
  medium: {
    backgroundColor: colors.quadColor,
    color: colors.secColor,
    paddingHorizontal: 6
  },
  horizLine: {
    height: 1,
    backgroundColor: colors.secColor,
    minWidth: layout.smallLineHeight
  },
  extend: {
    flex: 1
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center"
  }
})

export default styles
