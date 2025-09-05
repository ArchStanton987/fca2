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
import { useCombat } from "providers/CombatProvider"

export default function WeaponActions() {
  const { itemDbKey, actionSubtype, ...rest } = useActionForm()
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const character = useCharacter()
  const actorId = rest.actorId === "" ? character.charId : rest.actorId
  const contender = contenders[actorId].char

  const { setActionSubtype } = useActionApi()
  const inv = useInventory()
  let weapon = contender.unarmed
  const isHuman = contender instanceof Character
  if (itemDbKey) {
    weapon = isHuman
      ? inv.weaponsRecord[itemDbKey] ?? contender.unarmed
      : contender.equipedObjectsRecord.weapons[itemDbKey]
  }

  if (!weapon) return null

  const actions = getAvailableWeaponActions(weapon, contender)

  return (
    <ScrollSection style={{ flex: 1 }} title="action - pa">
      <List
        data={actions}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const apCost = getApCost(weapon, contender, item)
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
