import React from "react"
import { PressableProps } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useItem, useItems } from "lib/inventory/use-sub-inv-cat"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import Selectable from "components/Selectable"

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
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const { data: item } = useItem(charId, objDbKey)
  const { data: count } = useItems(
    charId,
    items => Object.values(items).filter(i => i.id === item.id).length
  )

  const { label } = item.data
  const countAppend = count > 1 ? ` (${count})` : ""
  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <ListLabel label={`${label}${countAppend}`} />
      <DeleteInput isSelected={isSelected} onPress={onPressDelete} />
    </Selectable>
  )
}
