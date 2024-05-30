import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import effectsMap from "lib/character/effects/effects"
import { Consumable } from "lib/objects/data/consumables/consumables.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import Caret from "components/icons/Caret"
import colors from "styles/colors"

import styles from "./ConsumableRow.styles"

export function ListHeader({ onPress, isAsc }: { onPress: () => void; isAsc: boolean }) {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <TouchableOpacity onPress={onPress} style={styles.labelHeader}>
        <Txt>PRODUIT</Txt>
        <Spacer x={3} />
        <Caret isVisible direction={isAsc ? "up" : "down"} />
      </TouchableOpacity>
      <View style={styles.effectContainer}>
        <Txt>EFFETS</Txt>
      </View>
      <View style={styles.deleteContainer} />
    </View>
  )
}

type ConsumableRowProps = PressableProps & {
  charConsumable: Consumable
  count: number
  isSelected: boolean
  onDelete: (item: Consumable) => void
}

export default function ConsumableRow({
  charConsumable,
  count,
  isSelected,
  onDelete,
  ...rest
}: ConsumableRowProps) {
  const { label, effectId, challengeLabel } = charConsumable.data
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
        {challengeLabel && <Txt>{challengeLabel}</Txt>}
      </View>
      <TouchableOpacity style={styles.deleteContainer} onPress={() => onDelete(charConsumable)}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </TouchableOpacity>
    </Pressable>
  )
}
