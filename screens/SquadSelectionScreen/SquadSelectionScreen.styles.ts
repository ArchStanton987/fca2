import { StyleSheet } from "react-native"

import typos from "styles/typos"

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontFamily: typos.jukebox,
    fontSize: 100,
    textAlign: "center"
  },
  text: {
    fontSize: 18,
    textAlign: "center"
  },
  squadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    padding: 10,
    marginHorizontal: 50
  },
  squadLabel: {
    textAlign: "center"
  }
})

export default styles
