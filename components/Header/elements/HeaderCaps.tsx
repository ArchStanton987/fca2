import React from "react"
import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import { Image } from "expo-image"

import capsIcon from "assets/images/caps-icon.png"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useSquad } from "contexts/SquadContext"
import { UpdateObjectsModalParams } from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.params"

export default function HeaderCaps() {
  const { caps } = useInventory()
  const { charId } = useCharacter()
  const { squadId } = useSquad()

  const onPress = () => {
    const pathname = routes.modal.updateObjects
    const params: UpdateObjectsModalParams = { charId, squadId, initCategory: "caps" }
    router.push({ pathname, params })
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
