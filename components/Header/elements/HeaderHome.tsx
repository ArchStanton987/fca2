import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { CharBottomTabScreenProps } from "nav/nav.types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"

export default function HeaderHome() {
  const navigation = useNavigation<CharBottomTabScreenProps<"Résumé">["navigation"]>()
  const { squadId } = useSquad()

  const onPress = () => navigation.navigate("ChoixPerso", { squadId })
  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <TouchableOpacity onPress={onPress}>
        <Txt style={{ fontSize: 12 }}>Accueil</Txt>
      </TouchableOpacity>
    </HeaderElement>
  )
}
