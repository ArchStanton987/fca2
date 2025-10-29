import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  container: {
    backgroundColor: colors.primColor,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  selected: {
    backgroundColor: colors.terColor
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 80
  },
  deleteContainer: {
    width: 100,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  header: {
    paddingTop: 0,
    paddingBottom: 10
  }
})

export default styles
