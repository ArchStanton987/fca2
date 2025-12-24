import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1
  },
  amountContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  categoriesContainer: {
    paddingTop: 5
  },
  listSection: {
    flex: 1
  },
  searchSection: {},
  addSection: {
    flex: 1
  },
  addSectionContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: 0
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
