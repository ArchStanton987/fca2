import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCharInfo } from "lib/character/character-provider"
import { useCarry } from "lib/inventory/use-sub-inv-cat"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { getPlaceColor } from "screens/MainTabs/RecapScreen/EquipedObjSection.utils"

export default function HeaderPlace() {
  const { charId } = useCharInfo()
  const { secAttr } = useAbilities()
  const carry = useCarry(charId)
  const { place } = carry.data
  const { maxPlace } = secAttr.curr

  const color = getPlaceColor(place, maxPlace)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ color, fontSize: 12 }}>PLACE: {place}</Txt>
      <Txt style={{ color, fontSize: 12 }}>/{maxPlace || "-"}</Txt>
    </HeaderElement>
  )
}
