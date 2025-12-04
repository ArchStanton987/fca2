import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderColor: colors.secColor
  },
  selected: {
    backgroundColor: colors.terColor
  },
  centeredSection: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default styles
