import { ActivityIndicator } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import Txt from "components/Txt"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import special from "models/character/special/special"
import { SpecialId, SpecialValues } from "models/character/special/special-types"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

import dbKeys from "../../../db/db-keys"

export default function HeaderSpecial({ specialId }: { specialId: SpecialId }) {
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { charId } = localParams
  const qk = dbKeys.char(charId).baseSpecial
  const specialValues: SpecialValues | null = useDbSubscribe(qk)

  if (!specialValues) return <ActivityIndicator size="small" color={colors.secColor} />

  const txt = `${special[specialId].short}: ${specialValues[specialId]}`

  return <Txt>{txt}</Txt>
}
