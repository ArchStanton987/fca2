import { ActivityIndicator } from "react-native"

import { useLocalSearchParams } from "expo-router/src/hooks"

import { Squad } from "db/Squad"
import dbKeys from "db/db-keys"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"
import { getDDMMYYYY, getHHMM } from "utils/date"

export default function HeaderDateTime() {
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { squadId } = localParams
  const qk = dbKeys.squad(squadId).index
  const squad: Squad | null = useDbSubscribe(qk)

  if (!squad) return <ActivityIndicator size="small" color={colors.secColor} />

  const time = getHHMM(new Date(squad.datetime * 1000))
  const date = getDDMMYYYY(new Date(squad.datetime * 1000), "-")
  return (
    <>
      <HeaderElement>
        <Txt>{date}</Txt>
      </HeaderElement>
      <HeaderElement>
        <Txt>{time}</Txt>
      </HeaderElement>
    </>
  )
}
