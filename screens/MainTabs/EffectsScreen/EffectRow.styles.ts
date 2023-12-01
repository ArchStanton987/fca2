import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  container: {
    backgroundColor: colors.primColor
  },
  selected: {
    backgroundColor: colors.terColor
  },
  labelContainer: {
    flex: 1
  },
  symptomsContainer: {
    width: 80
  },
  durationContainer: {
    width: 80,
    justifyContent: "flex-end"
  },
  deleteContainer: {
    width: 60,
    justifyContent: "flex-end"
  }
})

export default styles
