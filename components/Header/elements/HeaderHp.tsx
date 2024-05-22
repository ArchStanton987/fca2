import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { UpdateHealthModalParams } from "screens/MainTabs/modals/UpdateHealthModal/UpdateHealthModal.params"
import { SearchParams } from "screens/ScreenParams"

import HeaderElement from "../HeaderElement"

export default function HeaderHp() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const { health } = useCharacter()

  const onPress = () => {
    const pathname = routes.modal.updateHealth
    const params: UpdateHealthModalParams = { charId, squadId, initElement: "rightTorsoHp" }
    router.push({ pathname, params })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement style={{ flexGrow: 2, justifyContent: "flex-end", alignItems: "center" }}>
        <Txt>
          PV: {health.hp}/{health.maxHp}
        </Txt>
        <Spacer x={10} />
        <ProgressionBar value={health.hp} min={0} max={health.maxHp} />
      </HeaderElement>
    </TouchableOpacity>
  )
}
