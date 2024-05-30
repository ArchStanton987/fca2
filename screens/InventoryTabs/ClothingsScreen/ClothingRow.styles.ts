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
  equipedContainer: {
    width: 30
  },
  labelContainer: {
    alignSelf: "flex-start",
    justifyContent: "center",
    flex: 1
  },
  damageContainer: {
    width: 34,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  deleteContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  header: {
    paddingTop: 0,
    paddingBottom: 10
  }
})

export default styles
