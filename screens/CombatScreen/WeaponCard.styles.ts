import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  horizBar: {
    width: "100%",
    height: 1,
    backgroundColor: colors.secColor
  },
  imgContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.secColor
  },
  row: {
    flexDirection: "row"
  },
  attr: {
    width: 30
  },
  malus: {
    color: colors.yellow
  },
  divider: {
    width: 30,
    height: 2,
    backgroundColor: colors.secColor
  },
  actionButton: {
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.secColor,
    width: 120,
    alignItems: "center"
  },
  actionButtonText: {
    fontSize: 12
  },
  selected: {
    backgroundColor: colors.secColor,
    borderColor: colors.primColor
  },
  disabled: {
    backgroundColor: colors.quadColor,
    borderColor: colors.quadColor
  },
  disabledText: {
    color: colors.primColor
  },
  txtSelected: {
    color: colors.primColor
  },
  cardContainer: {
    width: 230
  },
  actionsContainer: {
    flex: 1
  },
  playContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  mag: {
    transform: [{ rotate: "90deg" }],
    backgroundColor: "red"
  }
})
export default styles
