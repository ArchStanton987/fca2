import React from "react"
import { View } from "react-native"

import Spacer from "components/Spacer"
import WithItemSeparator from "components/wrappers/WithItemSeparator"

import { HeaderElementId, headerElements } from "./Header.utils"

type HeaderProps = {
  headerElementsIds: HeaderElementId[]
}

export default function Header({ headerElementsIds }: HeaderProps) {
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <WithItemSeparator ItemSeparatorComponent={<Spacer x={2} />}>
        {headerElementsIds.map(el => headerElements[el])}
      </WithItemSeparator>
    </View>
  )
}
