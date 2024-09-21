import { TouchableOpacity } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { AdminScreenProps } from "nav/nav.types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"

export default function HeaderHome() {
  const navigation = useNavigation<AdminScreenProps<"Datetime">["navigation"]>()

  const onPress = () => navigation.navigate("Home")
  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <TouchableOpacity onPress={onPress}>
        <Txt style={{ fontSize: 12 }}>Accueil</Txt>
      </TouchableOpacity>
    </HeaderElement>
  )
}
