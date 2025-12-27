import { useState } from "react"
import { StyleSheet, View } from "react-native"

import SmallLine from "components/draws/Line/Line"
import colors from "styles/colors"
import layout from "styles/layout"

import ComposedTitle from "./ComposedTitle"
import { TitleType, TitleVariant } from "./Section.types"
import SimpleTitle from "./SimpleTitle"

const getStyles = (hasTitle: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hasTitle ? 0 : layout.smallLineHeight
    },
    smallLine: {
      top: hasTitle ? layout.smallLineHeight : 0
    },
    horizLine: {
      height: 1,
      backgroundColor: colors.secColor,
      minWidth: layout.smallLineHeight
    },
    extend: {
      flex: 1
    }
  })

export default function SectionTopRow(props: {
  title?: TitleType
  titleVariant?: TitleVariant
  onPressTitle?: () => void
}) {
  const { title, titleVariant = "default", onPressTitle } = props

  const styles = getStyles(title !== undefined)

  const isSimpleTitle = typeof title === "string"
  const isComposedTitle = Array.isArray(title)
  const hasNoTitle = title === undefined

  const [w, setW] = useState(0)

  return (
    <View
      style={styles.container}
      onLayout={e => {
        setW(e.nativeEvent.layout.width)
      }}
    >
      <SmallLine top left style={styles.smallLine} />
      <SmallLine top right style={styles.smallLine} />
      {isSimpleTitle ? (
        <SimpleTitle
          parentWidth={w}
          title={title}
          titleVariant={titleVariant}
          onPress={onPressTitle}
        />
      ) : null}
      {isComposedTitle ? <ComposedTitle title={title} /> : null}
      {hasNoTitle ? <View style={[styles.horizLine, styles.extend]} /> : null}
    </View>
  )
}
