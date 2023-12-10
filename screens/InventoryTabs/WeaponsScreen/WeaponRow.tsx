import React from "react"
import { Pressable, PressableProps, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"

import CheckBox from "components/CheckBox/CheckBox"
import Txt from "components/Txt"
import { WeaponId } from "models/objects/weapon/weapon-types"
import weaponsMap from "models/objects/weapon/weapons"
import colors from "styles/colors"

import styles from "./WeaponRow.styles"

export function ListHeader() {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <View style={styles.equipedContainer}>
        <Txt>EQU</Txt>
      </View>
      <View style={styles.labelContainer}>
        <Txt>NOM</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>DEG</Txt>
      </View>
      <View style={styles.skillContainer}>
        <Txt>COMP</Txt>
      </View>
      <View style={styles.ammoContainer}>
        <Txt>MUN</Txt>
      </View>
      <View style={styles.deleteContainer}>
        <Txt> </Txt>
      </View>
    </View>
  )
}

type WeaponRowProps = PressableProps & {
  weaponId: WeaponId
  isSelected: boolean
  isEquiped: boolean
  skillScore: number
  ammo?: number
}

export default function WeaponRow({
  weaponId,
  isSelected,
  isEquiped,
  skillScore,
  ammo,
  ...rest
}: WeaponRowProps) {
  const { label, damageBasic, damageBurst } = weaponsMap[weaponId]
  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.equipedContainer}>
        <CheckBox isChecked={isEquiped} />
      </View>
      <View style={styles.labelContainer}>
        <Txt>{label}</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>{damageBasic ?? "-"}</Txt>
        <Txt>{damageBurst ?? "-"}</Txt>
      </View>
      <View style={styles.skillContainer}>
        <Txt>{skillScore}</Txt>
      </View>
      <View style={styles.ammoContainer}>
        <Txt>{ammo || "-"}</Txt>
      </View>
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={20} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}
