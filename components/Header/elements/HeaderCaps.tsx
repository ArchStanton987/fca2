import React from "react"
import { ActivityIndicator, Image } from "react-native"

import { useLocalSearchParams } from "expo-router/src/hooks"

import capsIcon from "assets/images/caps-icon.png"
import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import useGetStatus from "hooks/db/useGetStatus"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function HeaderCaps() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const status = useGetStatus(charId)
  const isLoading = typeof status?.caps !== "number"

  return (
    <HeaderElement style={{ flexGrow: 2, justifyContent: "flex-end" }}>
      <Image
        resizeMode="contain"
        style={{ height: 15, width: 15, marginRight: 3 }}
        source={capsIcon}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.secColor} />
      ) : (
        <Txt>{status.caps}</Txt>
      )}
    </HeaderElement>
  )
}
