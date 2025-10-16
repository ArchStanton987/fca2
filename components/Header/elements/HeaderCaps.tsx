import React from "react"
import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Image } from "expo-image"
import { useCaps } from "lib/inventory/use-sub-inv-cat"
import { useBarterActions } from "lib/objects/barter-store"

import capsIcon from "assets/images/caps-icon.png"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import routes from "constants/routes"

export default function HeaderCaps() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const caps = useCaps(charId)

  const barterActions = useBarterActions()

  const onPress = () => {
    barterActions.selectCategory("caps")
    const pathname = routes.modal.barter
    router.push({ pathname, params: { charId, squadId } })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement style={{ flexGrow: 2, justifyContent: "flex-end" }}>
        <Image
          contentFit="contain"
          style={{ height: 15, width: 15, marginRight: 3 }}
          source={capsIcon}
        />
        <Txt style={{ fontSize: 12 }}>{caps.data}</Txt>
      </HeaderElement>
    </TouchableOpacity>
  )
}
