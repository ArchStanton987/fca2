import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
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
  }
})

export default styles
