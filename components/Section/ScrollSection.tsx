import { ScrollView, StyleProp, View, ViewStyle } from "react-native"

import layout from "styles/layout"

import Spacer from "../Spacer"
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
}

export default function ScrollSection({
  style,
  contentContainerStyle,
  title,
  titleVariant,
  children
}: ScrollableSectionProps) {
  return (
    <View style={[styles.container, style]}>
      <SectionTopRow title={title} titleVariant={titleVariant} />
      <ScrollView style={[styles.scrollView, contentContainerStyle]}>
        <Spacer y={layout.smallLineHeight} />
        {children}
        <Spacer y={layout.smallLineHeight} />
      </ScrollView>
      <SmallLine bottom right />
      <SmallLine bottom left />
    </View>
  )
}
