import React from "react"

import List from "components/List"
import Spacer from "components/Spacer"

import { HeaderElementId, headerElements } from "./Header.utils"

type HeaderProps = {
  headerElementsIds: HeaderElementId[]
}

export default function Header({ headerElementsIds }: HeaderProps) {
  return (
    <List
      data={headerElementsIds}
      horizontal
      style={{ flexDirection: "row", flex: 1 }}
      keyExtractor={item => item}
      separator={<Spacer x={2} />}
      renderItem={({ item }) => headerElements[item]}
    />
  )
}
