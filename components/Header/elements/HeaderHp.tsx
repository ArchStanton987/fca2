import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useHealth } from "lib/character/character-provider"

import { DrawerParams } from "components/Drawer/Drawer.params"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { UpdateHealthModalParams } from "screens/MainTabs/modals/UpdateHealthModal/UpdateHealthModal.params"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

import HeaderElement from "../HeaderElement"

export default function HeaderHp() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const health = useHealth()

  const onPress = () => {
    const pathname = routes.modal.updateHealth
    const params: UpdateHealthModalParams = { charId, squadId, initElement: "rightTorsoHp" }
    router.push({ pathname, params })
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
