import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { useCharInfo, useHealth } from "lib/character/character-provider"
import { radStates } from "lib/character/health/health.const"

import HeaderElement from "components/Header/HeaderElement"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useSquad } from "contexts/SquadContext"
import { UpdateHealthModalParams } from "screens/MainTabs/modals/UpdateHealthModal/UpdateHealthModal.params"
import colors from "styles/colors"

export default function HeaderRads() {
  const { squadId } = useSquad()
  const { charId } = useCharInfo()
  const health = useHealth()

  const getColor = () => {
    const radState = radStates.find(state => health.rads >= state.threshold)
    if (!radState) return colors.secColor
    return radState.color
  }

  const onPress = () => {
    const pathname = routes.modal.updateHealth
    const params: UpdateHealthModalParams = { squadId, charId, initElement: "rads" }
    router.push({ pathname, params })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement>
        <FontAwesome5 name="radiation" size={12} color={getColor()} />
        <Spacer x={5} />
        <Txt style={{ color: getColor(), fontSize: 12 }}>{health.rads}</Txt>
      </HeaderElement>
    </TouchableOpacity>
  )
}
