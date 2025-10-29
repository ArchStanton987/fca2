import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  equipedContainer: {
    width: 25
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1
  },
  damageContainer: {
    width: 34,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  deleteContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  header: {
    paddingTop: 0,
    paddingBottom: 10
  }
})

export default styles
