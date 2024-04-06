import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import effectsMap from "lib/character/effects/effects"
import { Consumable } from "lib/objects/data/consumables/consumables.types"

import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
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
  charConsumable: Consumable
  count: number
  isSelected: boolean
}

export default function ConsumableRow({
  charConsumable,
  count,
  isSelected,
  ...rest
}: ConsumableRowProps) {
  const character = useCharacter()
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
      <TouchableOpacity
        style={styles.deleteContainer}
        onPress={() => character.removeFromInv(charConsumable)}
      >
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </TouchableOpacity>
    </Pressable>
  )
}
