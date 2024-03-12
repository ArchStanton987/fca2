import { useContext } from "react"
import { ActivityIndicator } from "react-native"

import specialMap from "lib/character/abilities/special/special"
import { SpecialId } from "lib/character/abilities/special/special.types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { CurrAttrContext } from "providers/CurrAttrProvider"
import colors from "styles/colors"

export default function HeaderSpecialElement({ specialId }: { specialId: SpecialId }) {
  const { currSpecial } = useContext(CurrAttrContext)

  if (!currSpecial?.agility)
    return (
      <HeaderElement>
        <ActivityIndicator size="small" color={colors.secColor} />
      </HeaderElement>
    )

  const txt = `${specialMap[specialId].short}: ${currSpecial[specialId]}`

  return (
    <HeaderElement>
      <Txt>{txt}</Txt>
    </HeaderElement>
  )
}
