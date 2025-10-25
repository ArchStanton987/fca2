import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useExp } from "lib/character/progress/exp-provider"
import { getLevelAndThresholds } from "lib/character/status/status-calc"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { SearchParams } from "screens/ScreenParams"

export default function HeaderProgression() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const exp = useExp(charId)

  const { level, prev, next } = getLevelAndThresholds(exp.data)

  const onPress = () => {
    const pathname = routes.modal.updateExp
    router.push({ pathname, params: { squadId, charId } })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement>
        <Txt style={{ fontSize: 12 }}>NIV:{level}</Txt>
        <Spacer x={5} />
        <ProgressionBar value={exp.data} min={prev} max={next} width={40} />
      </HeaderElement>
    </TouchableOpacity>
  )
}
