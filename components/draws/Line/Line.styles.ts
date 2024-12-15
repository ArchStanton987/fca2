import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    backgroundColor: colors.secColor,
    zIndex: 1
  },
  top: {
    top: 0,
    height: layout.smallLineHeight,
    width: 1
  },
  right: {
    right: 0
  },
  left: {
    left: 0
  },
  bottom: {
    bottom: 0,
    height: layout.smallLineHeight,
    width: 1
  }
})
export default styles
