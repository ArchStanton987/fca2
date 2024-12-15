import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import SmallLine from "components/draws/Line/Line"
import colors from "styles/colors"
import layout from "styles/layout"

import { TitleType, TitleVariant } from "./Section/Section.types"
import SectionTopRow from "./Section/SectionTopRow"
import Spacer from "./Spacer"

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
      <Spacer y={title ? layout.smallLineHeight : layout.smallLineHeight * 2} />
      <View style={[{ paddingHorizontal: 5 }, contentContainerStyle]}>{children}</View>
      <Spacer y={layout.smallLineHeight} />
      <SmallLine bottom right />
      <SmallLine bottom left />
    </View>
  )
}
