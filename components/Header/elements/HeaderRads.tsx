import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { radStates } from "lib/character/health/health"
import { CharBottomTabScreenProps } from "nav/nav.types"

import HeaderElement from "components/Header/HeaderElement"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RadsIcon from "components/icons/RadsIcon"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

export default function HeaderRads() {
  const navigation = useNavigation<CharBottomTabScreenProps<"Résumé">["navigation"]>()
  const { health } = useCharacter()

  const getColor = () => {
    const radState = radStates.find(state => health.rads >= state.threshold)
    if (!radState) return colors.secColor
    return radState.color
  }

  const onPress = () => {
    navigation.push("UpdateHealth", { initElement: "rads" })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement>
        <RadsIcon color={getColor()} size={12} />
        <Spacer x={5} />
        <Txt style={{ color: getColor(), fontSize: 12 }}>{health.rads}</Txt>
      </HeaderElement>
    </TouchableOpacity>
  )
}
