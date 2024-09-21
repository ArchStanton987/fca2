import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"

export default function HeaderHome() {
  const onPress = () => router.push({ pathname: "/" })
  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <TouchableOpacity onPress={onPress}>
        <Txt style={{ fontSize: 12 }}>Accueil</Txt>
      </TouchableOpacity>
    </HeaderElement>
  )
}
