import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import SmallLine from "components/draws/Line/Line"
import colors from "styles/colors"
import layout from "styles/layout"

import { TitleType, TitleVariant } from "./Section/Section.types"
import SectionTopRow from "./Section/SectionTopRow"

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: colors.secColor
  }
})

type SectionProps = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  title?: TitleType
  titleVariant?: TitleVariant
}

export default function Section({
  children,
  style,
  contentContainerStyle,
  title,
  titleVariant
}: SectionProps) {
  return (
    <View style={[styles.container, style]}>
      <SectionTopRow title={title} titleVariant={titleVariant} />
      <View
        style={[
          {
            padding: 5,
            paddingTop: title ? 2 : layout.smallLineHeight,
            paddingBottom: layout.smallLineHeight
          },
          contentContainerStyle
        ]}
      >
        {children}
      </View>
      <SmallLine bottom right />
      <SmallLine bottom left />
    </View>
  )
}
