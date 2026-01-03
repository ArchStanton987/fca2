import { StyleSheet, View } from "react-native"

import List from "components/List"
import colors from "styles/colors"
import layout from "styles/layout"

import { ComposedTitleProps } from "./Section.types"
import SimpleTitle from "./SimpleTitle"

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1
  },
  titlePartContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  horizLine: {
    height: 1,
    backgroundColor: colors.secColor,
    minWidth: layout.smallLineHeight
  }
})

export default function ComposedTitle({
  title,
  parentWidth
}: {
  title: ComposedTitleProps
  parentWidth: number
}) {
  return (
    <List
      data={title}
      keyExtractor={item => item.title}
      horizontal
      style={styles.container}
      renderItem={({ item }) => (
        <View style={[styles.titlePartContainer, item.containerStyle]}>
          <SimpleTitle parentWidth={parentWidth} {...item} />
        </View>
      )}
    />
  )
}
