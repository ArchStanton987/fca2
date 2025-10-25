import { useLocalSearchParams } from "expo-router"

import { useSecAttr } from "lib/character/abilities/abilities-provider"
import { getWeightColor } from "lib/inventory/ui/EquipedObjSection.utils"
import { useCarry } from "lib/inventory/use-sub-inv-cat"

import HeaderElement from "components/Header/HeaderElement"
import Spacer from "components/Spacer"
import Txt from "components/Txt"

export default function HeaderWeight() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { data: secAttr } = useSecAttr(charId)
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight } = secAttr.curr
  const { weight } = useCarry(charId)

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
