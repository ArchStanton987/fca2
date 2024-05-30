import React from "react"
import { Pressable, PressableProps, TouchableOpacity, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import { MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import Caret from "components/icons/Caret"
import colors from "styles/colors"

import styles from "./MiscObjRow.styles"

export function ListHeader({ onPress, isAsc }: { onPress: () => void; isAsc: boolean }) {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <TouchableOpacity onPress={onPress} style={styles.labelContainer}>
        <Txt>OBJET</Txt>
        <Spacer x={3} />
        <Caret isVisible direction={isAsc ? "up" : "down"} />
      </TouchableOpacity>
      <View style={styles.deleteContainer} />
    </View>
  )
}

type MiscObjRowProps = PressableProps & {
  isSelected: boolean
  objId: MiscObjectId
  count: number
  onPressDelete: () => void
}

export default function MiscObjRow({
  isSelected,
  objId,
  count,
  onPressDelete,
  ...rest
}: MiscObjRowProps) {
  const { label } = miscObjectsMap[objId]
  const countAppend = count > 1 ? ` (${count})` : ""
  return (
    <Pressable style={[styles.row, styles.container, isSelected && styles.selected]} {...rest}>
      <View style={styles.labelContainer}>
        <Txt>
          {label}
          {countAppend}
        </Txt>
      </View>
      <TouchableOpacity style={styles.deleteContainer} onPress={onPressDelete}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </TouchableOpacity>
    </Pressable>
  )
}
