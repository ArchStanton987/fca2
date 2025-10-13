import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSquadLabel } from "lib/squad/use-cases/sub-squad"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"

export default function HeaderSquadName() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: label } = useSquadLabel(squadId)

  const onPress = () => router.push({ pathname: "/squad/[squadId]/", params: { squadId } })

  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <TouchableOpacity onPress={onPress}>
        <Txt style={{ fontSize: 12 }}>{label}</Txt>
      </TouchableOpacity>
    </HeaderElement>
  )
}
