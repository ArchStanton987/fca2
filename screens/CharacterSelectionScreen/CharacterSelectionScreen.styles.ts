import { StyleSheet } from "react-native"

import colors from "styles/colors"
import typos from "styles/typos"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  title: {
    fontFamily: typos.jukebox,
    fontSize: 100
  },
  charButton: {
    borderWidth: 2,
    borderColor: colors.secColor,
    padding: 20,
    width: 160,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: 18,
    textAlign: "center"
  }
})

export default styles
