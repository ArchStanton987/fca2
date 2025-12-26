import { TouchableOpacity, View } from "react-native"

import Txt from "components/Txt"

import { SimpleTitleProps } from "./Section.types"
import styles from "./SimpleTitle.styles"

export default function SimpleTitle(props: SimpleTitleProps) {
  const {
    title,
    titlePosition = "center",
    titleVariant = "default",
    textStyle,
    lineStyle,
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
        {hasText ? (
          <Txt style={[styles[titleVariant], textStyle]} numberOfLines={1}>
            {title.toUpperCase()}
          </Txt>
        ) : null}
      </TouchableOpacity>
      <View style={[styles.horizLine, titlePosition !== "right" && styles.extend, lineStyle]} />
    </>
  )
}
