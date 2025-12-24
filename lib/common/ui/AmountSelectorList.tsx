import { StyleSheet } from "react-native"

import AmountSelector from "components/AmountSelector"
import List from "components/List"

type AmountSelectorProps = {
  items: number[]
  selectedAmount: number
  onPressAmount: (item: number) => void
}

const styles = StyleSheet.create({
  amountContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap"
  }
})

export default function AmountSelectorList({
  items,
  selectedAmount,
  onPressAmount
}: AmountSelectorProps) {
  return (
    <List
      data={items}
      style={styles.amountContainer}
      keyExtractor={item => item.toString()}
      renderItem={({ item }) => (
        <AmountSelector
          value={item}
          isSelected={selectedAmount === item}
          onPress={() => onPressAmount(item)}
        />
      )}
    />
  )
}
