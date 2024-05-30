import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { Ammo } from "lib/objects/data/ammo/ammo.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import Caret from "components/icons/Caret"
import colors from "styles/colors"

import styles from "./AmmoRow.styles"
import { AmmoSort, AmmoSortableKey } from "./AmmoScreen.types"

type ListHeaderProps = {
  onPress: (type: AmmoSortableKey) => void
  sortState: AmmoSort
}

export function ListHeader({ onPress, sortState }: ListHeaderProps) {
  const { type, isAsc } = sortState
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <TouchableOpacity onPress={() => onPress("name")} style={styles.labelContainer}>
        <Txt>MUNITION</Txt>
        <Spacer x={3} />
        <Caret isVisible={type === "name"} direction={isAsc ? "up" : "down"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress("count")} style={styles.quantityContainer}>
        <Caret isVisible={type === "count"} direction={isAsc ? "up" : "down"} />
        <Spacer x={3} />
        <Txt>QUANTITE</Txt>
      </TouchableOpacity>
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
