import React from "react"
import { ActivityIndicator } from "react-native"

import { useLocalSearchParams } from "expo-router/src/hooks"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useGetStatus from "hooks/db/useGetStatus"
import { getLevelAndThresholds } from "models/character/character-utils"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function HeaderProgression() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const status = useGetStatus(charId)

  if (!status) return <ActivityIndicator size="small" color={colors.secColor} />

  const exp = status?.exp
  const { level, prev, next } = getLevelAndThresholds(exp)
  return (
    <HeaderElement>
      <Txt>NIV:{level}</Txt>
      <Spacer x={10} />
      <ProgressionBar value={exp} min={prev} max={next} />
    </HeaderElement>
  )
}
