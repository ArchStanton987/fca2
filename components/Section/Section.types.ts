import { StyleProp, TextStyle, ViewStyle } from "react-native"

export type TitleVariant = "default" | "shiny" | "medium"

export type SimpleTitleProps = {
  title: string
  titlePosition?: "center" | "left" | "right"
  titleVariant?: TitleVariant
  textStyle?: StyleProp<TextStyle>
  lineStyle?: StyleProp<ViewStyle>
  spacerWidth?: number
  onPress?: (str: string) => void
}

export type ComposedTitleProps = (SimpleTitleProps & { containerStyle?: StyleProp<ViewStyle> })[]

export type TitleType = string | ComposedTitleProps
