import React from "react"
import { PressableProps, View } from "react-native"

import Effect from "lib/character/effects/Effect"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"

import styles from "./EffectRow.styles"

type EffectRowProps = PressableProps & {
  effect: Effect
  isSelected: boolean
  onPress: () => void
  onPressDelete: () => void
}

export default function EffectRow({ effect, isSelected, onPress, onPressDelete }: EffectRowProps) {
  const { data, timeRemaining } = effect
  const { symptoms, label } = data

  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <ListLabel label={label} style={{ alignSelf: "flex-start" }} />
      <View style={styles.symptomsContainer}>
        {symptoms.map(symptom => {
          const valueLabel = symptom.value > 0 ? `+${symptom.value}` : symptom.value.toString()
          const displayValue = `${changeableAttributesMap[symptom.id].short}:${valueLabel}`
          return <Txt key={symptom.id}>{displayValue}</Txt>
        })}
      </View>
      <Spacer x={5} />
      <View style={styles.durationContainer}>
        <Txt>{timeRemaining || "-"}</Txt>
      </View>
      <Spacer x={5} />
      <DeleteInput isSelected={isSelected} onPress={onPressDelete} />
    </Selectable>
  )
}
