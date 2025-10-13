import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { useProgress } from "lib/character/use-cases/sub-playables"

import { DrawerParams } from "components/Drawer/Drawer.params"
import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { UpdateStatusModalParams } from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.params"
import { SearchParams } from "screens/ScreenParams"

export default function HeaderProgression() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const { exp } = useProgress()

  const { level, prev, next } = getLevelAndThresholds(exp)

  const onPress = () => {
    const pathname = routes.modal.updateStatus
    const params: UpdateStatusModalParams = { charId, squadId, initCategory: "exp" }
    router.push({ pathname, params })
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
