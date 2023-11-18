import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    backgroundColor: colors.secColor,
    zIndex: 1
  },
  top: {
    top: 0,
    height: 16,
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
    height: 16,
    width: 1
  }
})
export default styles
