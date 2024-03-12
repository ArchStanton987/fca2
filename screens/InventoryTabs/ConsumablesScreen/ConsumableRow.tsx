import React from "react"
import { Pressable, PressableProps, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import effectsMap from "lib/character/effects/effects"
import consumablesMap from "lib/objects/consumables/consumables"

import Txt from "components/Txt"
import { CharConsumable } from "hooks/db/useGetInventory"
import colors from "styles/colors"

import styles from "./ConsumableRow.styles"

export function ListHeader() {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <View style={styles.labelContainer}>
        <Txt>PRODUIT</Txt>
      </View>
      <View style={styles.effectContainer}>
        <Txt>EFFETS</Txt>
      </View>
      <View style={styles.deleteContainer} />
    </View>
  )
}

type ConsumableRowProps = PressableProps & {
  charConsumable: CharConsumable
  count: number
  isSelected: boolean
}

export default function ConsumableRow({
  charConsumable,
  count,
  isSelected,
  ...rest
}: ConsumableRowProps) {
  const { label, effectId } = consumablesMap[charConsumable.id]
  const symptoms = effectId ? effectsMap[effectId].symptoms : []
  const countAppend = count > 1 ? ` (${count})` : ""
  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.labelContainer}>
        <Txt>
          {label}
          {countAppend}
        </Txt>
      </View>
      <View style={styles.effectContainer}>
        {symptoms
          ? symptoms.map(({ id, value }) => {
              const prepend = value > 0 ? "+" : ""
              return (
                <Txt key={id}>{`${changeableAttributesMap[id].short}: ${prepend}${value}`}</Txt>
              )
            })
          : "-"}
      </View>
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}
