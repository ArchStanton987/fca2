import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"

export default function HeaderSquadName() {
  const squad = useSquad()
  const { label } = squad.data

  const onPress = () =>
    router.push({ pathname: "/squad/[squadId]/", params: { squadId: squad.squadId } })

  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <TouchableOpacity onPress={onPress}>
        <Txt style={{ fontSize: 12 }}>{label}</Txt>
      </TouchableOpacity>
    </HeaderElement>
  )
}
