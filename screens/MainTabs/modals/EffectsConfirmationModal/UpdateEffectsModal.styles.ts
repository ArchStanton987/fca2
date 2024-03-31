import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  listSection: {
    flex: 1
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primColor,
    paddingVertical: 8,
    padding: 5
  },
  listItemSelected: {
    backgroundColor: colors.terColor
  },
  searchSection: {
    width: 280,
    height: 90
  },
  addSection: {
    width: 280,
    flex: 1
  },
  infoSection: {
    width: 280,
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})
export default styles
