import { useCarry } from "lib/inventory/use-sub-inv-cat"

import HeaderElement from "components/Header/HeaderElement"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { getWeightColor } from "screens/MainTabs/RecapScreen/EquipedObjSection.utils"

export default function HeaderWeight() {
  const character = useCharacter()
  const { secAttr, charId } = character
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight } = secAttr.curr
  const carry = useCarry(charId)
  const { weight } = carry.data

  const color = getWeightColor(weight, secAttr.curr)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ color, fontSize: 12 }}>POIDS: {weight}</Txt>
      <Spacer x={10} />
      <Txt
        style={{ color, fontSize: 12 }}
      >{`(${normalCarryWeight}/${tempCarryWeight}/${maxCarryWeight})`}</Txt>
    </HeaderElement>
  )
}
