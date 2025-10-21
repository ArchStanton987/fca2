import React from "react"
import { PressableProps, View } from "react-native"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useAmmo } from "lib/inventory/use-sub-inv-cat"
import Toast from "react-native-toast-message"

import DeleteInput from "components/DeleteInput"
import EquipInput from "components/EquipInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"

import Weapon from "../Weapon"

type WeaponRowProps = PressableProps & {
  charId: string
  weapon: Weapon
  isSelected: boolean
  onPress: () => void
}

export default function WeaponRow({ charId, weapon, isSelected, onPress }: WeaponRowProps) {
  const useCases = useGetUseCases()

  const { data: abilities } = useAbilities(charId)
  const { data: ammo } = useAmmo(charId)

  const { isEquipped, data } = weapon
  const { label, damageBasic, damageBurst } = data

  const handleEquip = async () => {
    try {
      await useCases.character.toggleEquip({ charId, itemDbKey: weapon.dbKey })
    } catch (err: any) {
      if (err?.message) {
        Toast.show({ type: "custom", text1: err.message })
      }
    }
  }

  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <EquipInput isChecked={isEquipped} isParentSelected={isSelected} onPress={handleEquip} />
      <Spacer x={10} />
      <ListLabel label={label} />
      <Spacer x={5} />
      <View style={{ width: 75 }}>
        <Txt>{damageBasic ?? "-"}</Txt>
        <Txt>{damageBurst ?? "-"}</Txt>
      </View>
      <Spacer x={5} />
      <ListScoreLabel score={weapon.getSkillScore(abilities)} />
      <Spacer x={5} />
      <ListScoreLabel score={weapon.getAmmoCount(ammo) ?? "-"} />
      <Spacer x={5} />
      <DeleteInput
        isSelected={isSelected}
        onPress={() => useCases.inventory.drop({ charId, item: weapon })}
      />
    </Selectable>
  )
}
