import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import { getLevelAndThresholds } from "lib/character/status/status-calc"

import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import { UpdateStatusModalParams } from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.params"

export default function HeaderProgression() {
  const { squadId } = useSquad()
  const { charId, status } = useCharacter()
  const { exp } = status

  const { level, prev, next } = getLevelAndThresholds(exp)

  const onPress = () => {
    const pathname = routes.modal.updateStatus
    const params: UpdateStatusModalParams = { charId, squadId, initCategory: "exp" }
    router.push({ pathname, params })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement>
        <Txt>NIV:{level}</Txt>
        <Spacer x={10} />
        <ProgressionBar value={exp} min={prev} max={next} width={40} />
      </HeaderElement>
    </TouchableOpacity>
  )
}
