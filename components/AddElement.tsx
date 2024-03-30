import React from "react"
import { View } from "react-native"

import Txt from "./Txt"
import PlusIcon from "./icons/PlusIcon"

type AddElementProps = {
  title: string
  onPressAdd: () => void
}

export default function AddElement({ onPressAdd, title }: AddElementProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
      }}
    >
      <Txt>{title.toUpperCase()}</Txt>
      <PlusIcon onPress={onPressAdd} />
    </View>
  )
}
