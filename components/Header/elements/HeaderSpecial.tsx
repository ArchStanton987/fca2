import { useContext } from "react"
import { ActivityIndicator } from "react-native"

import Txt from "components/Txt"
import special from "models/character/special/special"
import { SpecialId } from "models/character/special/special-types"
import { CurrAttrContext } from "providers/CurrAttrProvider"
import colors from "styles/colors"

export default function HeaderSpecial({ specialId }: { specialId: SpecialId }) {
  const { currSpecial } = useContext(CurrAttrContext)

  if (!currSpecial) return <ActivityIndicator size="small" color={colors.secColor} />

  const txt = `${special[specialId].short}: ${currSpecial[specialId]}`

  return <Txt>{txt}</Txt>
}
