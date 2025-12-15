import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { useHealth } from "lib/character/health/health-provider"

import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

import HeaderElement from "../HeaderElement"

export default function HeaderHp() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const { data: health } = useHealth(charId)

  const onPress = () => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-health",
      params: { charId, squadId }
    })
  }

  const getColor = () => {
    if (health.currHp <= 0) return colors.red
    const currHpPercent = (health.currHp / health.maxHp) * 100
    if (currHpPercent < 25) return colors.orange
    if (currHpPercent < 50) return colors.yellow
    return colors.secColor
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement style={{ justifyContent: "flex-end", alignItems: "center" }}>
        <Txt style={{ fontSize: 12, color: getColor() }}>PV:</Txt>
        <Txt style={{ fontSize: 12, color: getColor() }}>
          {health.currHp}/{health.maxHp}
        </Txt>
        <Spacer x={5} />
        <ProgressionBar
          value={health.currHp}
          min={0}
          max={health.maxHp}
          color={getColor()}
          width={40}
        />
      </HeaderElement>
    </TouchableOpacity>
  )
}
