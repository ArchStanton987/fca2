import { StyleSheet } from "react-native"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primColor,
    flexDirection: "row",
    alignItems: "center",
    margin: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0
  },
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  levelContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default styles
