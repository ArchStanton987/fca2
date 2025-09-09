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
import { useCombatStatus } from "providers/CombatStatusesProvider"

export default function WeaponActions() {
  const { charId } = useCharacter()
  const { itemDbKey, actionSubtype, ...rest } = useActionForm()
  const actorId = rest.actorId === "" ? charId : rest.actorId
  const { currAp } = useCombatStatus(actorId)
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const contender = contenders[actorId]
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

  const actions = getAvailableWeaponActions(weapon, currAp, contender.secAttr.curr.actionPoints)

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
