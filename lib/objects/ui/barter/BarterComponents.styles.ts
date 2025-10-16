import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1
  },
  categoriesSection: {
    width: 120
  },
  listSection: {
    flex: 1
  },
  searchSection: {
    width: 200,
    height: 90
  },
  addSection: {
    width: 200,
    flex: 1
  },
  centeredSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 7
  },
  listItemContainerSelected: {
    backgroundColor: colors.terColor
  },
  listItem: {},
  listItemLabel: {
    flex: 1
  },
  listItemInfo: {
    width: 40,
    textAlign: "right"
  }
})

export default styles
