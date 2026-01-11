import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useQuery } from "@tanstack/react-query"
import { useCurrCharId } from "lib/character/character-store"
import { getExpOptions } from "lib/character/progress/exp-provider"
import { getLevelAndThresholds } from "lib/character/status/status-calc"

import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"

export default function HeaderProgression() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const exp = useQuery(getExpOptions(charId)).data ?? 0

  const { level, prev, next } = getLevelAndThresholds(exp)

  const onPress = () => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-exp",
      params: { squadId, charId }
    })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement>
        <Txt style={{ fontSize: 12 }}>NIV:{level}</Txt>
        <Spacer x={5} />
        <ProgressionBar value={exp} min={prev} max={next} width={40} />
      </HeaderElement>
    </TouchableOpacity>
  )
}
