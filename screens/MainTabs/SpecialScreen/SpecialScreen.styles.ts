import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  drawerPage: {
    marginLeft: layout.drawerWidth + layout.globalPadding,
    marginTop: layout.globalPadding
  },
  container: {
    paddingTop: 10,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.secColor
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0
  },
  listHeader: {
    paddingVertical: 0
  },
  rowSelected: {
    backgroundColor: colors.terColor
  },
  attributeRow: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  }
})
export default styles
