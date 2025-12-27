import { TouchableOpacity, View } from "react-native"

import Txt from "components/Txt"
import layout from "styles/layout"

import { SimpleTitleProps } from "./Section.types"
import styles from "./SimpleTitle.styles"

export default function SimpleTitle(props: SimpleTitleProps) {
  const {
    title,
    titlePosition = "center",
    titleVariant = "default",
    textStyle,
    lineStyle,
    onPress,
    parentWidth
  } = props

  const handleOnPress = () => {
    if (!onPress) return
    onPress(title)
  }

  const hasText = title.length > 0

  return (
    <>
      <View style={[styles.horizLine, titlePosition !== "left" && styles.extend, lineStyle]} />
      <TouchableOpacity
        disabled={!onPress}
        style={[
          styles.button,
          {
            maxWidth: parentWidth - 2 * layout.smallLineHeight
          }
        ]}
        onPress={handleOnPress}
      >
        {hasText ? (
          <Txt
            ellipsizeMode="tail"
            style={[styles[titleVariant], textStyle, { maxWidth: parentWidth }]}
            numberOfLines={1}
          >
            {title.toUpperCase()}
          </Txt>
        ) : null}
      </TouchableOpacity>
      <View style={[styles.horizLine, titlePosition !== "right" && styles.extend, lineStyle]} />
    </>
  )
}
