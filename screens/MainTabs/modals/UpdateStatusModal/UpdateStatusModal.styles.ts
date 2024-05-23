import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1
  },
  statusSection: {
    width: 160
  },
  listSection: {
    flex: 1
  },
  addSection: {
    width: 280
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingVertical: 7
  },
  listItemContainerSelected: {
    backgroundColor: colors.terColor
  },
  listItem: {}
})

export default styles
