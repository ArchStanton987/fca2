import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5
  },
  skillHeader: {
    backgroundColor: colors.primColor,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  equObjRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
})
export default styles
