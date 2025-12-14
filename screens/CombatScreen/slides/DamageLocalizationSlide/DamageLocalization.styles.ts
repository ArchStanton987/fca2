import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  cta: {
    padding: 20,
    backgroundColor: colors.secColor
  },
  ctaText: {
    color: colors.primColor
  },
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  score: {
    color: colors.secColor,
    fontSize: 42,
    lineHeight: 50
  },
  scoreContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default styles
