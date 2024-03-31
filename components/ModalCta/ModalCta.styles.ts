import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
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
    paddingVertical: 12,
    width: 120
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
