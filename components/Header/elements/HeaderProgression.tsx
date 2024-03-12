import React from "react"
import { ActivityIndicator } from "react-native"

import { useLocalSearchParams } from "expo-router/src/hooks"

import { getLevelAndThresholds } from "lib/character/status/status-calc"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useGetStatus from "hooks/db/useGetStatus"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function HeaderProgression() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const status = useGetStatus(charId)

  const exp = status?.exp || 0
  const { level, prev, next } = getLevelAndThresholds(exp)
  return (
    <HeaderElement>
      {typeof status?.exp !== "number" ? (
        <ActivityIndicator size="small" color={colors.secColor} />
      ) : (
        <>
          <Txt>NIV:{level || ""}</Txt>
          <Spacer x={10} />
          <ProgressionBar value={exp || 0} min={prev || 0} max={next || 1000} />
        </>
      )}
    </HeaderElement>
  )
}
