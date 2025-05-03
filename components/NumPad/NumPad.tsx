import { StyleSheet, TouchableHighlight, TouchableHighlightProps } from "react-native"

import Feather from "@expo/vector-icons/Feather"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

const styles = StyleSheet.create({
  digit: {
    fontSize: 20
  },
  digitContainer: {
    backgroundColor: colors.primColor,
    borderWidth: 2,
    borderColor: colors.secColor,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 60
  }
})

type KeyPadProps = TouchableHighlightProps & {
  value: string
}

function Digit({ value }: { value: string }) {
  if (value === "del") return <Feather name="delete" size={20} color={colors.secColor} />
  if (value === "clear") return <MaterialIcons name="clear" size={20} color={colors.secColor} />
  if (!Number.isNaN(Number(value))) return <Txt style={styles.digit}>{value}</Txt>
  return null
}

function DigitContainer({ value, onPress, ...rest }: KeyPadProps) {
  return (
    <TouchableHighlight style={styles.digitContainer} onPress={onPress} {...rest}>
      <Digit value={value} />
    </TouchableHighlight>
  )
}

const row1 = ["7", "8", "9"]
const row2 = ["4", "5", "6"]
const row3 = ["1", "2", "3"]
const row4 = ["del", "0", "clear"]
const rows = [
  { id: "row1", values: row1 },
  { id: "row2", values: row2 },
  { id: "row3", values: row3 },
  { id: "row4", values: row4 }
]

type NumPadProps = {
  onPressKeyPad: (value: string) => void
}

export default function NumPad({ onPressKeyPad }: NumPadProps) {
  return (
    <List
      data={rows}
      style={{ flexGrow: 1 }}
      keyExtractor={item => item.id}
      separator={<Spacer y={15} />}
      renderItem={({ item }) => (
        <List
          horizontal
          style={{ flexGrow: 1 }}
          data={Array.from(item.values)}
          keyExtractor={e => e}
          separator={<Spacer x={20} />}
          renderItem={params => (
            <DigitContainer value={params.item} onPress={() => onPressKeyPad(params.item)} />
          )}
        />
      )}
    />
  )
}
