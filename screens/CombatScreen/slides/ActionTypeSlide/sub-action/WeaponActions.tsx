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
import {
  useActionActorId,
  useActionApi,
  useActionItemDbKey,
  useActionSubtype
} from "providers/ActionFormProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"

export default function WeaponActions() {
  const { charId } = useCharacter()
  const formActorId = useActionActorId()
  const itemDbKey = useActionItemDbKey()
  const actionSubtype = useActionSubtype()
  const actorId = formActorId === "" ? charId : formActorId
  const { currAp } = useCombatStatuses(actorId)
  const contender = useContenders(actorId)
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
