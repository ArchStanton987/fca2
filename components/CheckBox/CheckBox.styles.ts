import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: colors.secColor,
    backgroundColor: colors.primColor
  },
  content: {
    height: 38,
    width: 38
  },
  checked: {
    backgroundColor: colors.secColor
  }
})

export default styles
