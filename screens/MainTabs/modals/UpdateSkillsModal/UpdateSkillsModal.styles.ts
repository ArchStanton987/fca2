import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: 8
  },
  label: {
    flex: 1
  },
  baseValue: {
    width: 100,
    textAlign: "right"
  },
  modContainer: {
    flexDirection: "row",
    width: 200
  },
  upValue: {
    width: 50,
    textAlign: "right"
  },
  totalValue: {
    width: 100,
    textAlign: "right"
  }
})

export default styles
