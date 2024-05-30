import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import combatModsMap from "lib/character/combat/combat-mods"
import useCases from "lib/common/use-cases"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import Toast from "react-native-toast-message"

import CheckBox from "components/CheckBox/CheckBox"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import Caret from "components/icons/Caret"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import styles from "./ClothingRow.styles"
import { ClothingSort, ClothingSortableKey } from "./ClothingsScreen.types"

export function ListHeader({
  onPress,
  sortState
}: {
  onPress: (type: ClothingSortableKey) => void
  sortState: ClothingSort
}) {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <TouchableOpacity
        onPress={() => onPress("equiped")}
        style={[styles.row, styles.equipedContainer]}
      >
        <Txt>EQU</Txt>
        <Spacer x={3} />
        <Caret type="equiped" sortState={sortState} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress("name")} style={[styles.row, styles.labelContainer]}>
        <Txt>OBJET</Txt>
        <Spacer x={3} />
        <Caret type="name" sortState={sortState} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("physRes")}
        style={[styles.row, styles.damageContainer]}
      >
        <Caret type="physRes" sortState={sortState} />
        <Spacer x={2} />
        <Txt>PHY</Txt>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("lasRes")}
        style={[styles.row, styles.damageContainer]}
      >
        <Caret type="lasRes" sortState={sortState} />
        <Spacer x={2} />
        <Txt>LAS</Txt>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("fireRes")}
        style={[styles.row, styles.damageContainer]}
      >
        <Caret type="fireRes" sortState={sortState} />
        <Spacer x={2} />
        <Txt>FEU</Txt>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("plaRes")}
        style={[styles.row, styles.damageContainer]}
      >
        <Caret type="plaRes" sortState={sortState} />
        <Spacer x={2} />
        <Txt>PLA</Txt>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress("malus")}
        style={[styles.row, styles.damageContainer]}
      >
        <Caret type="malus" sortState={sortState} />
        <Spacer x={2} />
        <Txt>MAL</Txt>
      </TouchableOpacity>
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
