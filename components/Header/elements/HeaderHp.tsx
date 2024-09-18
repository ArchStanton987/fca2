import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProps } from "nav/nav.types"

import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import { UpdateHealthModalParams } from "screens/MainTabs/modals/UpdateHealthModal/UpdateHealthModal.params"
import colors from "styles/colors"

import HeaderElement from "../HeaderElement"

export default function HeaderHp() {
  const navigation = useNavigation<RootStackNavigationProps<"Personnage">>()
  const { squadId } = useSquad()
  const { charId, health } = useCharacter()

  const onPress = () => {
    const params: UpdateHealthModalParams = { charId, squadId, initElement: "rightTorsoHp" }
    navigation.navigate("Personnage", { screen: "UpdateHealth", params })
  }

  const getColor = () => {
    if (health.hp <= 0) return colors.red
    const currHpPercent = (health.hp / health.maxHp) * 100
    if (currHpPercent < 25) return colors.orange
    if (currHpPercent < 50) return colors.yellow
    return colors.secColor
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement style={{ justifyContent: "flex-end", alignItems: "center" }}>
        <Txt style={{ fontSize: 12, color: getColor() }}>PV:</Txt>
        <Txt style={{ fontSize: 12, color: getColor() }}>
          {health.hp}/{health.maxHp}
        </Txt>
        <Spacer x={5} />
        <ProgressionBar
          value={health.hp}
          min={0}
          max={health.maxHp}
          color={getColor()}
          width={40}
        />
      </HeaderElement>
    </TouchableOpacity>
  )
}
