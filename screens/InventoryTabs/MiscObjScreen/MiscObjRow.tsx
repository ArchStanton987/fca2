import React from "react"
import { PressableProps } from "react-native"

import { MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"

import DeleteInput from "components/DeleteInput"
import ListLabel from "components/ListLabel"
import Selectable from "components/Selectable"
import useCreatedElements from "hooks/context/useCreatedElements"

type MiscObjRowProps = PressableProps & {
  isSelected: boolean
  objId: MiscObjectId
  count: number
  onPress: () => void
  onPressDelete: () => void
}

export default function MiscObjRow({
  isSelected,
  objId,
  count,
  onPress,
  onPressDelete
}: MiscObjRowProps) {
  const { newMiscObjects } = useCreatedElements()
  const { label } = newMiscObjects[objId]
  const countAppend = count > 1 ? ` (${count})` : ""
  return (
    <Selectable isSelected={isSelected} onPress={onPress}>
      <ListLabel label={`${label}${countAppend}`} />
      <DeleteInput isSelected={isSelected} onPress={onPressDelete} />
    </Selectable>
  )
}
