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
  labelContainer: {
    alignSelf: "flex-start",
    flex: 1
  },
  symptomsContainer: {
    width: 80
  },
  durationContainer: {
    alignSelf: "flex-start",
    width: 80,
    alignItems: "flex-end"
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 50
  },
  header: {
    paddingTop: 0,
    paddingBottom: 10
  }
})

export default styles
