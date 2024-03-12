import React from "react"
import { Pressable, PressableProps, View } from "react-native"

import { AntDesign } from "@expo/vector-icons"
import miscObjectsMap from "lib/objects/misc-objects/misc-objects"
import { MiscObjectId } from "lib/objects/misc-objects/misc-objects-types"

import Txt from "components/Txt"
import colors from "styles/colors"

import styles from "./MiscObjRow.styles"

export function ListHeader() {
  return (
    <View style={[styles.row, styles.container, styles.header]}>
      <View style={styles.labelContainer}>
        <Txt>OBJET</Txt>
      </View>
      <View style={styles.deleteContainer} />
    </View>
  )
}

type MiscObjRowProps = PressableProps & {
  isSelected: boolean
  objId: MiscObjectId
  count: number
}

export default function MiscObjRow({ isSelected, objId, count, ...rest }: MiscObjRowProps) {
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
      <View style={styles.deleteContainer}>
        {isSelected && <AntDesign name="delete" size={17} color={colors.secColor} />}
      </View>
    </Pressable>
  )
}
