import HeaderElement from "components/Header/HeaderElement"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { getWeightColor } from "screens/MainTabs/RecapScreen/EquipedObjSection.utils"

export default function HeaderWeight() {
  const character = useCharacter()
  const inventory = useInventory()
  const { secAttr } = character
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight } = secAttr.curr
  const { currWeight } = inventory.currentCarry

  const color = getWeightColor(currWeight, secAttr.curr)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ color, fontSize: 12 }}>POIDS: {currWeight}</Txt>
      <Spacer x={10} />
      <Txt
        style={{ color, fontSize: 12 }}
      >{`(${normalCarryWeight}/${tempCarryWeight}/${maxCarryWeight})`}</Txt>
    </HeaderElement>
  )
}
