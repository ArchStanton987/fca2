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
  },
  version: {
    fontSize: 8,
    position: "absolute",
    right: 0,
    top: 5
  }
})

export default styles
