import {
  getApCost,
  getAvailableWeaponActions,
  getWeaponActionLabel
} from "lib/objects/data/weapons/weapons-utils"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionForm } from "providers/ActionProvider"

type WeaponActionsProps = {
  selectedWeapon: string
  onPress: (action: string) => void
}

export default function WeaponActions({ selectedWeapon, onPress }: WeaponActionsProps) {
  const { actionSubtype } = useActionForm()
  const char = useCharacter()
  const inv = useInventory()
  const weapon = inv.weaponsRecord[selectedWeapon]

  if (!weapon) return null

  const actions = getAvailableWeaponActions(weapon, char)

  return (
    <List
      data={actions}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <ListItemSelectable
          isSelected={actionSubtype === item}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
          onPress={() => onPress(item)}
        >
          <Txt>{getWeaponActionLabel(weapon, item)}</Txt>
          <Txt>{getApCost(weapon, char, item)}</Txt>
        </ListItemSelectable>
      )}
    />
  )
}
