import { useContext } from "react"
import { ActivityIndicator } from "react-native"

import HeaderSpecialElement from "components/Header/elements/HeaderSpecialElement"
import { specialArray } from "models/character/special/special"
import { CurrAttrContext } from "providers/CurrAttrProvider"
import colors from "styles/colors"

export default function HeaderSpecial() {
  const { currSpecial } = useContext(CurrAttrContext)

  if (!currSpecial) return <ActivityIndicator size="small" color={colors.secColor} />

  return specialArray.map(({ id }) => <HeaderSpecialElement specialId={id} />)
}
