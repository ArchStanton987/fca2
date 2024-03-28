import { Pressable, PressableProps, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import combatModsMap from "lib/character/combat/combat-mods"
import clothingsMap from "lib/objects/clothings/clothings"
import { ClothingId } from "lib/objects/clothings/clothings.types"

import CheckBox from "components/CheckBox/CheckBox"
import Txt from "components/Txt"
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
  clothingId: ClothingId
  isSelected: boolean
  isEquiped: boolean
}

export default function ClothingRow({
  clothingId,
  isSelected,
  isEquiped,
  ...rest
}: ClothingRowProps) {
  const {
    label,
    physicalDamageResist,
    laserDamageResist,
    fireDamageResist,
    plasmaDamageResist,
    malus
  } = clothingsMap[clothingId]

  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.equipedContainer}>
        <CheckBox
          isChecked={isEquiped}
          containerStyle={{ backgroundColor: isSelected ? colors.terColor : colors.secColor }}
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
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}