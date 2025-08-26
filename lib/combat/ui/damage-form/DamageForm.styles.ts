import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "transparent",
    padding: 3,
    alignItems: "center",
    gap: 3
  },
  selected: {
    borderColor: colors.secColor
  },
  locCol: {
    width: 100
  },
  dmgCol: {
    width: 30
  },
  input: {
    paddingRight: 5
  }
})

export default styles
