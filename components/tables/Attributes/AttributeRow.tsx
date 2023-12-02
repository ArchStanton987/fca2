import { Pressable, View } from "react-native"

import Txt from "components/Txt"

import styles from "./AttributeRow.styles"

type RowProps = {
  label: string
  values: {
    baseValue: number | string
    upValue?: number | string
    modValue: number | string
    currValue: number | string
  }
  isSelected?: boolean
  onPress?: () => void
  isHeader?: boolean
  unit?: string
}

export default function AttributeRow(props: RowProps) {
  const { label, values, isSelected = false, onPress, isHeader = false, unit } = props
  return (
    <Pressable
      style={[styles.row, isSelected && styles.rowSelected, isHeader && styles.listHeader]}
      onPress={onPress}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Txt>{label}</Txt>
      </View>
      {Object.entries(values).map(([key, value]) => {
        let preprend = ""
        const cpyValue = typeof value === "string" ? parseInt(value, 10) : value
        if (key === "modValue") {
          preprend = cpyValue > 0 ? "+" : ""
        }
        return (
          <View key={`${label}-${key}`} style={styles.attributeRow}>
            <Txt>
              {preprend}
              {value}
              {unit}
            </Txt>
          </View>
        )
      })}
    </Pressable>
  )
}

export function AttributeHeader() {
  return (
    <AttributeRow
      isHeader
      label="ATTRIBUT"
      values={{
        baseValue: "BASE",
        modValue: "MOD",
        currValue: "TOT"
      }}
    />
  )
}

export function SkillsHeader() {
  return (
    <AttributeRow
      isHeader
      label="ATTRIBUT"
      values={{
        baseValue: "BASE",
        upValue: "UP",
        modValue: "MOD",
        currValue: "TOT"
      }}
    />
  )
}
