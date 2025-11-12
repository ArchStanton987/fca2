import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  cta: {
    padding: 12,
    borderWidth: 2,
    borderColor: colors.secColor,
    width: 130,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default styles
