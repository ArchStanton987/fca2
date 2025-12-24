import { StyleSheet, View } from "react-native"

import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})

export default function ModQuantityButtons({
  size,
  onPressMinus,
  onPressPlus
}: {
  size?: number
  onPressMinus: () => void
  onPressPlus: () => void
}) {
  return (
    <View style={styles.iconsContainer}>
      <MinusIcon size={size ?? 55} onPress={onPressMinus} />
      <PlusIcon size={size ?? 55} onPress={onPressPlus} />
    </View>
  )
}
