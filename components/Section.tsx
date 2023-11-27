import { StyleSheet, View, ViewProps } from "react-native"

import SmallLine from "components/draws/Line/Line"
import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.secColor
  }
})

type SectionProps = ViewProps

export default function Section({ children, style }: SectionProps) {
  return (
    <View style={[styles.container, style]}>
      <SmallLine top right />
      {children}
    </View>
  )
}
