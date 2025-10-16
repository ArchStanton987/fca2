import { StyleSheet, View } from "react-native"

import Txt from "components/Txt"
import colors from "styles/colors"

const styles = StyleSheet.create({
  category: {
    textAlign: "center",
    backgroundColor: colors.terColor,
    padding: 4
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2
  }
})

export function RecapCategory({ title }: { title: string }) {
  return <Txt style={styles.category}>{title}</Txt>
}

export function RecapEntry({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.listItemContainer}>
      <Txt>{label}</Txt>
      <Txt>
        {count > 0 ? "x" : null}
        {count}
      </Txt>
    </View>
  )
}
