import { StyleSheet } from "react-native"

import typos from "styles/typos"

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontFamily: typos.jukebox,
    fontSize: 70,
    textAlign: "center"
  },
  charButton: {
    flex: 1,
    padding: 20,
    maxWidth: 160,
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontSize: 18,
    textAlign: "center"
  }
})

export default styles
