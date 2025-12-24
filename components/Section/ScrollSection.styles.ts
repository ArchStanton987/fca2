import { StyleSheet } from "react-native"

import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  container: {
    borderColor: colors.secColor,
    borderBottomWidth: 1
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 5,
    paddingBottom: layout.smallLineHeight
  }
})

export default styles
