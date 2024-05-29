import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import useCases from "lib/common/use-cases"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import Toast from "react-native-toast-message"

import CheckBox from "components/CheckBox/CheckBox"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { Sort, Sortable } from "screens/InventoryTabs/WeaponsScreen/WeaponsScreen.types"
import colors from "styles/colors"

import styles from "./WeaponRow.styles"

function Caret({ type, sortState }: { type: Sortable; sortState: Sort }) {
  if (sortState.type !== type) return null
  return (
    <AntDesign name={sortState.isAsc ? "caretup" : "caretdown"} size={17} color={colors.secColor} />
  )
}

export function ListHeader({
  onPress,
  sortState
}: {
  onPress: (type: Sortable) => void
  sortState: Sort
}) {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <TouchableOpacity
        onPress={() => onPress("equiped")}
        style={[styles.listHeader, styles.equipedContainer]}
      >
        <Txt>EQU</Txt>
        <Caret type="equiped" sortState={sortState} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("name")}
        style={[styles.listHeader, styles.labelContainer]}
      >
        <Txt>NOM</Txt>
        <Caret type="name" sortState={sortState} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("damage")}
        style={[styles.listHeader, styles.damageContainer]}
      >
        <Txt>DEG</Txt>
        <Caret type="damage" sortState={sortState} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("skill")}
        style={[styles.listHeader, styles.skillContainer]}
      >
        <Txt>COMP</Txt>
        <Caret type="skill" sortState={sortState} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("ammo")}
        style={[styles.listHeader, styles.ammoContainer]}
      >
        <Txt>MUN</Txt>
        <Caret type="ammo" sortState={sortState} />
      </TouchableOpacity>
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

  const handleEquip = async () => {
    try {
      await useCases.equipedObjects.toggle(character, weapon)
    } catch (err: any) {
      if (err?.message) {
        Toast.show({ type: "custom", text1: err.message })
      }
    }
  }

  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.equipedContainer}>
        <CheckBox
          isChecked={isEquiped}
          containerStyle={{ backgroundColor: isSelected ? colors.terColor : colors.primColor }}
          onPress={handleEquip}
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
        onPress={() => useCases.inventory.throw(character.charId, weapon)}
      >
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </TouchableOpacity>
    </Pressable>
  )
}
