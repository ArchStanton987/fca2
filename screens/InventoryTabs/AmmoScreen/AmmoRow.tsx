import React from "react"
import { Pressable, PressableProps, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { Ammo } from "lib/objects/data/ammo/ammo.types"

import Txt from "components/Txt"
import colors from "styles/colors"

import styles from "./AmmoRow.styles"

export function ListHeader() {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <View style={styles.labelContainer}>
        <Txt>MUNITION</Txt>
      </View>
      <View style={styles.quantityContainer}>
        <Txt>QUANTITE</Txt>
      </View>
      <View style={styles.deleteContainer} />
    </View>
  )
}

type AmmoRowProps = PressableProps & {
  ammo: Ammo
  isSelected: boolean
}

export default function AmmoRow({ ammo, isSelected, ...rest }: AmmoRowProps) {
  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.labelContainer}>
        <Txt>{ammo.data.label}</Txt>
      </View>
      <View style={styles.quantityContainer}>
        <Txt>{ammo.amount}</Txt>
      </View>
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}
