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
  listHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  equipedContainer: {
    width: 40
  },
  labelContainer: {
    flex: 1
  },
  damageContainer: {
    width: 60
  },
  skillContainer: {
    width: 50,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  ammoContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 55
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
