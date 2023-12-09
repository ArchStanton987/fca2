import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  armsContainer: {
    position: "absolute",
    top: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  torsoContainer: {
    position: "absolute",
    top: 52,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  legsContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  img: {
    width: 80,
    height: 80
  }
})

export default styles
