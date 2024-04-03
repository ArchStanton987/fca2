import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import colors from "styles/colors"
import typos from "styles/typos"

export default function HeaderHome() {
  const { squadId } = useSquad()

  const onPress = () =>
    router.push({
      pathname: "/squad/[squadId]/",
      params: { squadId }
    })
  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <TouchableOpacity onPress={onPress}>
        <Txt
          style={{
            color: colors.secColor,
            fontFamily: typos.jukebox,
            fontSize: 25,
            textAlign: "center"
          }}
        >
          {"<FCA>"}
        </Txt>
      </TouchableOpacity>
    </HeaderElement>
  )
}
