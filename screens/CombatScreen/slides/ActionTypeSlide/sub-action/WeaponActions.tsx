import Character from "lib/character/Character"
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
  const isHuman = char instanceof Character
  if (itemDbKey) {
    weapon = isHuman
      ? inv.weaponsRecord[itemDbKey] ?? char.unarmed
      : char.equipedObjectsRecord.weapons[itemDbKey]
  }

  if (!weapon) return null

  const actions = getAvailableWeaponActions(weapon, char)

  return (
    <ScrollSection style={{ flex: 1 }} title="action - pa">
      <List
        data={actions}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const apCost = getApCost(weapon, char, item)
          return (
            <ListItemSelectable
              isSelected={actionSubtype === item}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => setActionSubtype(item, apCost)}
            >
              <Txt>{getWeaponActionLabel(weapon, item)}</Txt>
              <Txt>{apCost}</Txt>
            </ListItemSelectable>
          )
        }}
      />
    </ScrollSection>
  )
}
