import { ScrollView, StyleProp, View, ViewStyle } from "react-native"

import layout from "styles/layout"

import SmallLine from "../draws/Line/Line"
import styles from "./ScrollSection.styles"
import { TitleType, TitleVariant } from "./Section.types"
import SectionTopRow from "./SectionTopRow"

type ScrollableSectionProps = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  title?: TitleType
  titleVariant?: TitleVariant
  onPressTitle?: () => void
}

// TODO: fix title as array
export default function ScrollSection({
  style,
  contentContainerStyle,
  title,
  titleVariant,
  onPressTitle,
  children
}: ScrollableSectionProps) {
  return (
    <View style={[styles.container, style]}>
      <SectionTopRow title={title} titleVariant={titleVariant} onPressTitle={onPressTitle} />
      <ScrollView
        style={[styles.scrollView, { paddingTop: title ? 2 : layout.smallLineHeight }]}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </ScrollView>
      <SmallLine bottom right />
      <SmallLine bottom left />
    </View>
  )
}
