import React from "react"
import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import { CharBottomTabScreenProps } from "nav/nav.types"

import capsIcon from "assets/images/caps-icon.png"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useSquad } from "contexts/SquadContext"

export default function HeaderCaps() {
  const navigation = useNavigation<CharBottomTabScreenProps<"Résumé">["navigation"]>()
  const { squadId } = useSquad()
  const { charId } = useCharacter()
  const { caps } = useInventory()

  const onPress = () => {
    navigation.navigate("UpdateObjects", { initCategory: "caps" })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement style={{ flexGrow: 2, justifyContent: "flex-end" }}>
        <Image
          contentFit="contain"
          style={{ height: 15, width: 15, marginRight: 3 }}
          source={capsIcon}
        />
        <Txt style={{ fontSize: 12 }}>{caps}</Txt>
      </HeaderElement>
    </TouchableOpacity>
  )
}
