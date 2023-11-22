import { ActivityIndicator } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { Squad } from "db/Squad"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"
import { getDDMMYYYY } from "utils/date"

import dbKeys from "../../../db/db-keys"

export default function HeaderDate() {
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { squadId } = localParams
  const qk = dbKeys.squad(squadId).index
  const squad: Squad | null = useDbSubscribe(qk)

  if (!squad) return <ActivityIndicator size="small" color={colors.secColor} />

  const datetime = getDDMMYYYY(new Date(squad.datetime * 1000), "-")

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt>{datetime}</Txt>
    </HeaderElement>
  )
}
