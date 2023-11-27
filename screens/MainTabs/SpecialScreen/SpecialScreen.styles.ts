import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.primColor,
    flexDirection: "row",
    alignItems: "center",
    margin: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0
  },
  listHeader: {
    paddingVertical: 0
  },
  rowSelected: {
    backgroundColor: colors.terColor
  },
  attributeRow: {
    width: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  }
})
export default styles
