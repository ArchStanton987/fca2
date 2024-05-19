import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import combatModsMap from "lib/character/combat/combat-mods"
import useCases from "lib/common/use-cases"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import Toast from "react-native-toast-message"

import CheckBox from "components/CheckBox/CheckBox"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import styles from "./ClothingRow.styles"

export function ListHeader() {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <View style={styles.equipedContainer}>
        <Txt>EQU</Txt>
      </View>
      <View style={styles.labelContainer}>
        <Txt>OBJET</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>PHY</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>LAS</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>FEU</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>PLA</Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>MAL</Txt>
      </View>
      <View style={styles.deleteContainer} />
    </View>
  )
}

type ClothingRowProps = PressableProps & {
  clothing: Clothing
  isSelected: boolean
}

export default function ClothingRow({ clothing, isSelected, ...rest }: ClothingRowProps) {
  const character = useCharacter()
  const { isEquiped, data } = clothing
  const {
    label,
    physicalDamageResist,
    laserDamageResist,
    fireDamageResist,
    plasmaDamageResist,
    malus
  } = data

  const handleEquip = async () => {
    try {
      await useCases.equipedObjects.toggle(character, clothing)
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
        <Txt>
          {physicalDamageResist}
          {combatModsMap.physicalDamageResist.unit}
        </Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>
          {laserDamageResist}
          {combatModsMap.laserDamageResist.unit}
        </Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>
          {fireDamageResist}
          {combatModsMap.fireDamageResist.unit}
        </Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>
          {plasmaDamageResist}
          {combatModsMap.plasmaDamageResist.unit}
        </Txt>
      </View>
      <View style={styles.damageContainer}>
        <Txt>{malus}</Txt>
      </View>
      <TouchableOpacity
        style={styles.deleteContainer}
        onPress={() => useCases.inventory.throw(character.charId, clothing)}
      >
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </TouchableOpacity>
    </Pressable>
  )
}
