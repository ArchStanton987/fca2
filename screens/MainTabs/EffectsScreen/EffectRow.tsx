import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import { Effect } from "lib/character/effects/effects.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

import styles from "./EffectRow.styles"

type EffectRowProps = PressableProps & {
  effect: Effect
  isSelected: boolean
  onPressDelete: () => void
}

export function EffectHeader() {
  return (
    <View style={[styles.container, styles.row, styles.header]}>
      <View style={[styles.labelContainer, styles.row]}>
        <Txt>EFFET</Txt>
      </View>
      <View style={styles.symptomsContainer}>
        <Txt>SYMPTOMES</Txt>
      </View>
      <View style={styles.durationContainer}>
        <Txt>DUREE</Txt>
      </View>
      <View style={styles.deleteContainer} />
    </View>
  )
}

export default function EffectRow({ effect, isSelected, onPressDelete, ...rest }: EffectRowProps) {
  const { data, timeRemaining } = effect
  const { symptoms, label } = data

  return (
    <Pressable style={[styles.container, styles.row, isSelected && styles.selected]} {...rest}>
      <View style={[styles.labelContainer, styles.row]}>
        <Txt>{label}</Txt>
      </View>
      <View style={styles.symptomsContainer}>
        {symptoms.map(symptom => {
          const valueLabel = symptom.value > 0 ? `+${symptom.value}` : symptom.value.toString()
          const displayValue = `${changeableAttributesMap[symptom.id].short}:${valueLabel}`
          return <Txt key={symptom.id}>{displayValue}</Txt>
        })}
      </View>
      <View style={styles.durationContainer}>
        <Txt>{timeRemaining || "-"}</Txt>
      </View>
      {isSelected && effect.dbKey ? (
        <TouchableOpacity style={styles.deleteContainer} onPress={onPressDelete}>
          <AntDesign name="delete" size={17} color={colors.secColor} />
        </TouchableOpacity>
      ) : (
        <Spacer x={styles.deleteContainer.width} />
      )}
    </Pressable>
  )
}
