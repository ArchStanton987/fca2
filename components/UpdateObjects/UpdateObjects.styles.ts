import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
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
  },

  selectorsSection: {
    flex: 1,
    justifyContent: "space-around"
  },
  amountContainer: {
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  buttonsSection: {
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  centeredSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})

export default styles
