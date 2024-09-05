import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  horizBar: {
    width: "100%",
    height: 1,
    backgroundColor: colors.secColor
  },
  imgContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.secColor
  },
  row: {
    flexDirection: "row"
  },
  attr: {
    width: 30
  }
})
export default styles
