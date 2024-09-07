import { StyleSheet } from "react-native"

import colors from "styles/colors"

const getStyles = (color: string = colors.secColor) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      height: 18,
      width: 18,
      borderWidth: 1,
      borderColor: color,
      backgroundColor: colors.primColor
    },
    content: {
      height: 10,
      width: 10
    },
    checked: {
      backgroundColor: color
    }
  })

export default getStyles
