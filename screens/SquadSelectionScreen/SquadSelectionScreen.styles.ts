import { StyleSheet } from "react-native"

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
  text: {
    fontSize: 18,
    textAlign: "center"
  }
})

export default styles
