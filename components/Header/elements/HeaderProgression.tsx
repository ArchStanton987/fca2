import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { CharBottomTabScreenProps } from "nav/nav.types"

import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function HeaderProgression() {
  const navigation = useNavigation<CharBottomTabScreenProps<"Résumé">["navigation"]>()
  const { status } = useCharacter()
  const { exp } = status

  const { level, prev, next } = getLevelAndThresholds(exp)

  const onPress = () => {
    navigation.push("UpdateStatus", { initCategory: "exp" })
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
