import React from "react"
import { Pressable, PressableProps, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { AntDesign } from "@expo/vector-icons"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import effectsMap from "lib/character/effects/effects"
import { Effect } from "lib/character/effects/effects.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import Txt from "components/Txt"
import useGetSquad from "hooks/db/useGetSquad"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

import styles from "./EffectRow.styles"

type EffectRowProps = PressableProps & {
  effect: Effect
  isSelected: boolean
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

export default function EffectRow({ effect, isSelected, ...rest }: EffectRowProps) {
  // TODO: FIX, using useSquad & calc effect length remaining
  const { squadId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const squad = useGetSquad(squadId)
  const date = squad?.datetime ? new Date(squad.datetime * 1000) : null
  const effectStart = effect.startTs ? new Date(effect.startTs * 1000) : null
  const shouldDisplayLength = date !== null && effectStart !== null
  const lengthLabel = shouldDisplayLength ? date.getTime() - effectStart.getTime() : "-"

  const { label, symptoms } = effectsMap[effect.id]

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
        <Txt>{lengthLabel}</Txt>
      </View>
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}
