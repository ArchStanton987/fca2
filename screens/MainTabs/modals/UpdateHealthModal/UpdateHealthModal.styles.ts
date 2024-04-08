import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1
  },
  categoriesSection: {
    width: 160
  },
  listSection: {
    flex: 1
  },
  searchSection: {
    width: 280,
    height: 90
  },
  addSection: {
    width: 280,
    flex: 1
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
  listItem: {},
  selected: {
    backgroundColor: colors.terColor
  }
})

export default styles
