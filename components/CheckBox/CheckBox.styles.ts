import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: colors.secColor,
    backgroundColor: colors.primColor
  },
  content: {
    height: 10,
    width: 10
  },
  checked: {
    backgroundColor: colors.secColor
  }
})

export default styles
