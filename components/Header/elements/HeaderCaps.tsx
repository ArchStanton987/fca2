import React from "react"
import { Image } from "react-native"

import capsIcon from "assets/images/caps-icon.png"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function HeaderCaps() {
  const character = useCharacter()
  const { caps } = character.status

  return (
    <HeaderElement style={{ flexGrow: 2, justifyContent: "flex-end" }}>
      <Image
        resizeMode="contain"
        style={{ height: 15, width: 15, marginRight: 3 }}
        source={capsIcon}
      />
      <Txt>{caps}</Txt>
    </HeaderElement>
  )
}
