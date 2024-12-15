import { TouchableOpacity, View } from "react-native"

import Spacer from "components/Spacer"
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
    spacerWidth = layout.smallLineHeight,
    onPress
  } = props

  const handleOnPress = () => {
    if (!onPress) return
    onPress(title)
  }

  const hasText = title.length > 0

  return (
    <>
      <View style={[styles.horizLine, titlePosition !== "left" && styles.extend, lineStyle]} />
      <TouchableOpacity disabled={!onPress} style={styles.button} onPress={handleOnPress}>
        <Spacer x={spacerWidth} />
        {hasText ? (
          <Txt style={[styles[titleVariant], textStyle]}>{title.toUpperCase()}</Txt>
        ) : null}
        <Spacer x={spacerWidth} />
      </TouchableOpacity>
      <View style={[styles.horizLine, titlePosition !== "right" && styles.extend, lineStyle]} />
    </>
  )
}
