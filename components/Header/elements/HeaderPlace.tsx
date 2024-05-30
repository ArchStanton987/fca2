import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { getPlaceColor } from "screens/MainTabs/RecapScreen/EquipedObjSection.utils"

export default function HeaderPlace() {
  const character = useCharacter()
  const { maxPlace } = character.secAttr.curr
  const inventory = useInventory()
  const { currPlace } = inventory.currentCarry

  const color = getPlaceColor(currPlace, maxPlace)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ color, fontSize: 12 }}>PLACE: {currPlace}</Txt>
      <Txt style={{ color, fontSize: 12 }}>/{maxPlace || "-"}</Txt>
    </HeaderElement>
  )
}
