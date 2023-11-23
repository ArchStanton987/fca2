import { ActivityIndicator } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import useGetSquad from "hooks/db/useGetSquad"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"
import { getDDMMYYYY } from "utils/date"

export default function HeaderDate() {
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { squadId } = localParams
  const squad = useGetSquad(squadId)

  if (!squad) return <ActivityIndicator size="small" color={colors.secColor} />

  const datetime = getDDMMYYYY(new Date(squad.datetime * 1000), "-")

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt>{datetime}</Txt>
    </HeaderElement>
  )
}
