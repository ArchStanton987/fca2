import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCurrCharId } from "lib/character/character-store"
import { getPlaceColor } from "lib/inventory/ui/EquipedObjSection.utils"
import { useCarry } from "lib/inventory/use-sub-inv-cat"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"

export default function HeaderPlace() {
  const charId = useCurrCharId()
  const { data: maxPlace } = useAbilities(charId, data => data.secAttr.curr.maxPlace)
  const { place } = useCarry(charId)

  const color = getPlaceColor(place, maxPlace)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ color, fontSize: 12 }}>PLACE: {place}</Txt>
      <Txt style={{ color, fontSize: 12 }}>/{maxPlace || "-"}</Txt>
    </HeaderElement>
  )
}
