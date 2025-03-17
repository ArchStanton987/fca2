import React from "react"
import { PressableProps, TouchableOpacity, View } from "react-native"

import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import { Consumable } from "lib/objects/data/consumables/consumables.types"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import Caret from "components/icons/Caret"
import useCreatedElements from "hooks/context/useCreatedElements"

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
  onPress: () => void
  onDelete: (item: Consumable) => void
}

export default function ConsumableRow({
  charConsumable,
  count,
  isSelected,
  onDelete,
  onPress,
  ...rest
}: ConsumableRowProps) {
  const { newEffects } = useCreatedElements()
  const { label, effectId, challengeLabel, modifiers = [] } = charConsumable.data
  const symptoms = effectId ? newEffects[effectId].symptoms : []
  const visibleMods = [...symptoms, ...modifiers]
  const countAppend = count > 1 ? ` (${count})` : ""
  return (
    <Selectable isSelected={isSelected} onPress={onPress} {...rest}>
      <ListLabel label={`${label}${countAppend}`} style={{ alignSelf: "flex-start" }} />
      <View style={styles.effectContainer}>
        {visibleMods
          ? visibleMods.map(({ id, value }) => {
              const prepend = value > 0 ? "+" : ""
              return (
                <Txt key={id}>{`${changeableAttributesMap[id].short}: ${prepend}${value}`}</Txt>
              )
            })
          : "-"}
        {challengeLabel && <Txt>{challengeLabel}</Txt>}
      </View>
      <DeleteInput isSelected={isSelected} onPress={() => onDelete(charConsumable)} />
    </Selectable>
  )
}
