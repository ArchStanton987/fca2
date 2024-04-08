import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import CheckBox from "components/CheckBox/CheckBox"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
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
  weapon: Weapon
  isSelected: boolean
}

export default function WeaponRow({ weapon, isSelected, ...rest }: WeaponRowProps) {
  const character = useCharacter()
  const { isEquiped, skill, ammo, data } = weapon
  const { label, damageBasic, damageBurst } = data
  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.equipedContainer}>
        <CheckBox
          isChecked={isEquiped}
          containerStyle={{ backgroundColor: isSelected ? colors.terColor : colors.primColor }}
          onPress={() => character.toggleEquip(weapon)}
        />
      </View>
      <View style={styles.labelContainer}>
        <Txt>{label}</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>{damageBasic ?? "-"}</Txt>
        <Txt>{damageBurst ?? "-"}</Txt>
      </View>
      <View style={styles.skillContainer}>
        <Txt>{skill}</Txt>
      </View>
      <View style={styles.ammoContainer}>
        <Txt>{ammo || "-"}</Txt>
      </View>
      <TouchableOpacity
        style={styles.deleteContainer}
        onPress={() => character.removeFromInv(weapon, isEquiped)}
      >
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </TouchableOpacity>
    </Pressable>
  )
}
