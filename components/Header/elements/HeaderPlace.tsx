import { useCarry } from "lib/inventory/use-sub-inv-cat"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { getPlaceColor } from "screens/MainTabs/RecapScreen/EquipedObjSection.utils"

export default function HeaderPlace() {
  const character = useCharacter()
  const { maxPlace } = character.secAttr.curr
  const carry = useCarry(character.charId)
  const { place } = carry.data

  const color = getPlaceColor(place, maxPlace)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ color, fontSize: 12 }}>PLACE: {place}</Txt>
      <Txt style={{ color, fontSize: 12 }}>/{maxPlace || "-"}</Txt>
    </HeaderElement>
  )
}
