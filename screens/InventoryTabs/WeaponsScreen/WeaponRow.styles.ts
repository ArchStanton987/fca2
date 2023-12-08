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
  equipedContainer: {
    width: 80
  },
  labelContainer: {
    alignSelf: "flex-start",
    flex: 1
  },
  damageContainer: {
    width: 80
  },
  skillContainer: {
    alignSelf: "flex-start",
    width: 80,
    alignItems: "flex-end"
  },
  ammoContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 50
  },
  deleteContainer: {
    paddingTop: 0,
    paddingBottom: 10
  },
  header: {
    paddingTop: 0,
    paddingBottom: 10
  }
})

export default styles
