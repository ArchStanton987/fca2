import React from "react"
import { PressableProps, View } from "react-native"

import { Weapon } from "lib/objects/data/weapons/weapons.types"
import Toast from "react-native-toast-message"

import DeleteInput from "components/DeleteInput"
import EquipInput from "components/EquipInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useGetUseCases } from "providers/UseCasesProvider"

type WeaponRowProps = PressableProps & {
  weapon: Weapon
  isSelected: boolean
  onPress: () => void
}

export default function WeaponRow({ weapon, isSelected, onPress }: WeaponRowProps) {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const { isEquiped, skill, ammo, data } = weapon
  const { label, damageBasic, damageBurst, ammoType } = data

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
    <Selectable isSelected={isSelected} onPress={onPress}>
      <EquipInput isChecked={isEquiped} isParentSelected={isSelected} onPress={handleEquip} />
      <Spacer x={10} />
      <ListLabel label={label} />
      <Spacer x={5} />
      <View style={{ width: 75 }}>
        <Txt>{damageBasic ?? "-"}</Txt>
        <Txt>{damageBurst ?? "-"}</Txt>
      </View>
      <Spacer x={5} />
      <ListScoreLabel score={skill} />
      <Spacer x={5} />
      <ListScoreLabel score={ammoType ? ammo : "-"} />
      <Spacer x={5} />
      <DeleteInput
        isSelected={isSelected}
        onPress={() => useCases.inventory.drop(character.charId, weapon)}
      />
    </Selectable>
  )
}
