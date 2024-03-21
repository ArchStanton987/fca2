import specialMap from "lib/character/abilities/special/special"
import { SpecialId } from "lib/character/abilities/special/special.types"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function HeaderSpecialElement({ specialId }: { specialId: SpecialId }) {
  const character = useCharacter()
  const label = specialMap[specialId].short
  const value = character.special.curr[specialId]
  const txt = `${label}: ${value}`

  return (
    <HeaderElement>
      <Txt>{txt}</Txt>
    </HeaderElement>
  )
}
