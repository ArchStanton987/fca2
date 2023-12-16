import React from "react"
import { Pressable, PressableProps, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"

import Txt from "components/Txt"
import ammoMap from "models/objects/ammo/ammo"
import { AmmoType } from "models/objects/ammo/ammo-types"
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
  ammoId: AmmoType
  amount: number
  isSelected: boolean
}

export default function AmmoRow({ ammoId, amount, isSelected, ...rest }: AmmoRowProps) {
  const { label } = ammoMap[ammoId]
  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.labelContainer}>
        <Txt>{label}</Txt>
      </View>
      <View style={styles.quantityContainer}>
        <Txt>{amount}</Txt>
      </View>
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}
