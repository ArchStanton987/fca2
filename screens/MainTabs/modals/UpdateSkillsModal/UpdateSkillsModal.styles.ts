import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    width: 200
  },
  upValue: {
    width: 50,
    textAlign: "center"
  },
  newUpValue: {
    width: 70,
    textAlign: "center",
    fontSize: 18,
    color: colors.orange
  },
  totalValue: {
    textAlign: "right",
    fontSize: 18,
    padding: 3
  },
  totalValueSec: {
    backgroundColor: colors.secColor,
    color: colors.primColor
  }
})

export default styles
