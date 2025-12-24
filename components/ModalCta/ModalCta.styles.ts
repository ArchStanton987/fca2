import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const ctaHeight = 44

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.secColor
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: layout.globalPadding
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  cta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secColor,
    borderWidth: 1,
    borderColor: colors.secColor,
    width: 120,
    height: ctaHeight
  },
  horizLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: colors.secColor
  },
  ctaText: {
    color: colors.primColor
  },
  ctaSec: {
    backgroundColor: colors.primColor
  },
  ctaTextSec: {
    color: colors.secColor
  }
})
export default styles
