import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scoreContainer: {
    alignItems: "center"
  },
  score: {
    fontSize: 35
  },
  finalScore: {
    fontSize: 45
  },
  scoreDetailRow: {
    justifyContent: "center",
    alignItems: "flex-end"
  },
  outcome: {
    textAlign: "center"
  },
  critSuccess: {
    color: colors.difficulty.veryEasy
  },
  critFail: {
    color: colors.difficulty.veryHard
  },
  success: {
    color: colors.difficulty.easy
  },
  fail: {
    color: colors.difficulty.hard
  }
})

export default styles
