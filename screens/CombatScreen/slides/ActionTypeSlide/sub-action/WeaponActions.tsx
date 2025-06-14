import {
  getApCost,
  getAvailableWeaponActions,
  getWeaponActionLabel
} from "lib/objects/data/weapons/weapons-utils"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"

export default function WeaponActions() {
  const { itemDbKey, actionSubtype } = useActionForm()
  const { setActionSubtype } = useActionApi()
  const char = useCharacter()
  const inv = useInventory()
  let weapon = char.unarmed
  if (itemDbKey) {
    weapon = inv.weaponsRecord[itemDbKey] ?? char.unarmed
  }

  if (!weapon) return null

  const actions = getAvailableWeaponActions(weapon, char)

  return (
    <ScrollSection style={{ flex: 1 }} title="action - pa">
      <List
        data={actions}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <ListItemSelectable
            isSelected={actionSubtype === item}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            onPress={() => setActionSubtype(item)}
          >
            <Txt>{getWeaponActionLabel(weapon, item)}</Txt>
            <Txt>{getApCost(weapon, char, item)}</Txt>
          </ListItemSelectable>
        )}
      />
    </ScrollSection>
  )
}
