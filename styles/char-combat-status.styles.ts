import { StyleSheet } from "react-native"

import colors from "./colors"

const charCombatStatusStyles = StyleSheet.create({
  active: {
    color: colors.secColor
  },
  done: {
    color: colors.terColor
  },
  dead: {
    textDecorationLine: "line-through"
  },
  wait: {
    color: colors.difficulty.veryEasy
  }
})

export default charCombatStatusStyles
