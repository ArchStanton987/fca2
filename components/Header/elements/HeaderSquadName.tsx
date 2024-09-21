import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { AdminScreenProps } from "nav/nav.types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"

export default function HeaderSquadName() {
  const navigation = useNavigation<AdminScreenProps<"Datetime">["navigation"]>()
  const squad = useSquad()
  const { label } = squad.data

  const onPress = () => navigation.replace("ChoixPerso", { squadId: squad.squadId })

  return (
    <TouchableOpacity onPress={onPress}>
      <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
        <Txt style={{ fontSize: 12 }}>{label}</Txt>
      </HeaderElement>
    </TouchableOpacity>
  )
}
