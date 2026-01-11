import React from "react"
import { PressableProps } from "react-native"

import { useCurrCharId } from "lib/character/character-store"
import { useItem, useItems } from "lib/inventory/use-sub-inv-cat"
import Toast from "react-native-toast-message"

import DeleteInput from "components/DeleteInput"
import EquipInput from "components/EquipInput"
import ListLabel from "components/ListLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import { useGetUseCases } from "providers/UseCasesProvider"

type MiscObjRowProps = PressableProps & {
  isSelected: boolean
  objDbKey: string
  onPress: () => void
  onPressDelete: () => void
}

export default function MiscObjRow({
  isSelected,
  objDbKey,
  onPress,
  onPressDelete
}: MiscObjRowProps) {
  const useCases = useGetUseCases()
  const charId = useCurrCharId()

  const { data: item } = useItem(charId, objDbKey)
  const { data: count } = useItems(
    charId,
    items => Object.values(items).filter(i => i.id === item.id).length
  )

  const { label } = item.data
  const countAppend = count > 1 ? ` (${count})` : ""

  const handleEquip = async () => {
    try {
      await useCases.character.toggleEquip({ charId, itemDbKey: item.dbKey })
    } catch (err: any) {
      if (err?.message) {
        Toast.show({ type: "custom", text1: err.message })
      }
    }
  }

  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <EquipInput isChecked={item.isEquipped} isParentSelected={isSelected} onPress={handleEquip} />
      <Spacer x={10} />
      <ListLabel label={`${label}${countAppend}`} />
      <DeleteInput isSelected={isSelected} onPress={onPressDelete} />
    </Selectable>
  )
}
