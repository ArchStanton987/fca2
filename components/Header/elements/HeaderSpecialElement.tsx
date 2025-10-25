import { useLocalSearchParams } from "expo-router"

import { useSpecial } from "lib/character/abilities/abilities-provider"
import specialMap from "lib/character/abilities/special/special"
import { SpecialId } from "lib/character/abilities/special/special.types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"

export default function HeaderSpecialElement({ specialId }: { specialId: SpecialId }) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { data: special } = useSpecial(charId)
  const label = specialMap[specialId].short
  const value = special.curr[specialId]

  return (
    <HeaderElement>
      <Txt style={{ fontSize: 12 }}>{label}:</Txt>
      <Txt style={{ fontSize: 12 }}>{value}</Txt>
    </HeaderElement>
  )
}
