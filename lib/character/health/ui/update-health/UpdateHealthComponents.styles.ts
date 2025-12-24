import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  categoriesSection: {
    width: 160
  },
  listSection: {
    flex: 1
  },
  addSection: {
    width: 200
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
  listItem: {},
  listItemLabel: { flex: 1 },
  listItemInfo: {
    width: 40,
    textAlign: "right"
  },
  amountContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  addSectionContainer: {
    flex: 1,
    justifyContent: "space-evenly"
  }
})

export default styles
