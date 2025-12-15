import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import Health from "lib/character/health/Health"
import { useHealth } from "lib/character/health/health-provider"
import { radStates } from "lib/character/health/health.const"
import { useUpdateHealthActions } from "lib/character/health/update-health-store"

import HeaderElement from "components/Header/HeaderElement"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

const getColor = (health: Health) => {
  const radState = radStates.find(state => health.rads >= state.threshold)
  if (!radState) return colors.secColor
  return radState.color
}

export default function HeaderRads() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  const { data: health } = useHealth(charId)

  const healthActions = useUpdateHealthActions()

  const onPress = () => {
    healthActions.selectCategory("rads")
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-health",
      params: { squadId, charId }
    })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement>
        <FontAwesome5 name="radiation" size={12} color={getColor(health)} />
        <Spacer x={5} />
        <Txt style={{ color: getColor(health), fontSize: 12 }}>{health.rads}</Txt>
      </HeaderElement>
    </TouchableOpacity>
  )
}
