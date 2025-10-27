import { useAbilities, useSecAttr, useTraits } from "lib/character/abilities/abilities-provider"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useAmmo, useCombatWeapons, useItem } from "lib/inventory/use-sub-inv-cat"
import {
  getAvailableWeaponActions,
  getWeaponActionLabel
} from "lib/objects/data/weapons/weapons-utils"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionApi,
  useActionItemDbKey,
  useActionSubtype
} from "providers/ActionFormProvider"

export default function WeaponActions({ charId }: { charId: string }) {
  const formActorId = useActionActorId()
  const itemDbKey = useActionItemDbKey()
  const actionSubtype = useActionSubtype()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: currAp } = useCombatStatus(actorId, s => s.currAp)
  const { data: maxAp } = useAbilities(actorId, a => a.secAttr.curr.actionPoints)
  const { data: traits } = useTraits(actorId)
  const { data: secAttr } = useSecAttr(actorId)
  const { data: ammo } = useAmmo(actorId)
  const { setActionSubtype } = useActionApi()

  const { data: actionWeapon } = useItem(actorId, itemDbKey ?? "")
  const weapons = useCombatWeapons(actorId)
  const weapon = actionWeapon ?? weapons[0]

  if (weapon.category !== "weapons") return null

  const actions = getAvailableWeaponActions(weapon, { currAp, maxAp }, ammo)

  return (
    <ScrollSection style={{ flex: 1 }} title="action - pa">
      <List
        data={actions}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const apCost = weapon.getApCost(traits, secAttr, item)
          return (
            <ListItemSelectable
              isSelected={actionSubtype === item}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => {
                if (apCost === null) return
                setActionSubtype(item, apCost)
              }}
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
