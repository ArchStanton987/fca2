import { useContext } from "react"
import { ActivityIndicator } from "react-native"

import Txt from "components/Txt"
import special from "models/character/special/special"
import { SpecialId } from "models/character/special/special-types"
import { BaseContext } from "providers/BaseProvider"
import colors from "styles/colors"

export default function HeaderSpecial({ specialId }: { specialId: SpecialId }) {
  const { baseSpecial } = useContext(BaseContext)

  if (!baseSpecial) return <ActivityIndicator size="small" color={colors.secColor} />

  const txt = `${special[specialId].short}: ${baseSpecial[specialId]}`

  return <Txt>{txt}</Txt>
}
