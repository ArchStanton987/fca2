import { useContext } from "react"
import { ActivityIndicator } from "react-native"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import special from "models/character/special/special"
import { SpecialId } from "models/character/special/special-types"
import { CurrAttrContext } from "providers/CurrAttrProvider"
import colors from "styles/colors"

export default function HeaderSpecialElement({ specialId }: { specialId: SpecialId }) {
  const { currSpecial } = useContext(CurrAttrContext)

  if (!currSpecial) return <ActivityIndicator size="small" color={colors.secColor} />

  const txt = `${special[specialId].short}: ${currSpecial[specialId]}`

  return (
    <HeaderElement>
      <Txt>{txt}</Txt>
    </HeaderElement>
  )
}
