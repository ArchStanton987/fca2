import { View } from "react-native"

import List from "components/List"
import ListLabel from "components/ListLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import layout from "styles/layout"

type RowProps = {
  label: string
  values: {
    baseValue: number | string
    upValue?: number | string
    modValue: number | string
    currValue: number | string
  }
  isSelected?: boolean
  onPress: () => void
  unit?: string
}

export default function AttributeRow(props: RowProps) {
  const { label, values, isSelected = false, onPress, unit } = props
  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <ListLabel label={label} />
      <List
        data={Object.entries(values)}
        keyExtractor={item => item[0]}
        horizontal
        separator={<Spacer x={layout.smallLineHeight} />}
        renderItem={({ item }) => {
          const [key, value] = item
          let preprend = ""
          const cpyValue = typeof value === "string" ? parseInt(value, 10) : value
          if (key === "modValue") {
            preprend = cpyValue > 0 ? "+" : ""
          }
          return (
            <View
              key={`${label}-${key}`}
              style={{
                width: 45,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Txt>
                {preprend}
                {value}
                {unit}
              </Txt>
            </View>
          )
        }}
      />
    </Selectable>
  )
}
