import { Pressable } from "react-native"

import actions from "lib/combat/const/actions"

import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { isKeyOf } from "utils/ts-utils"

import WeaponInfo from "../../WeaponInfo"
import ItemsActionInfo from "./ItemsActionInfo"
import MovementInfo from "./MovementInfo"

export default function ActionInfo() {
  const { itemDbKey, actionType, actionSubtype, ...rest } = useActionForm()
  const { charId } = useCharacter()
  const { setForm } = useActionApi()
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const actorId = rest.actorId === "" ? charId : rest.actorId
  const contender = contenders[actorId]
  const { equipedObjects, unarmed } = contender
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const currentIndex = weapons.findIndex(w => w.dbKey === itemDbKey)
    const nextIndex = (currentIndex + 1) % weapons.length
    const { dbKey } = weapons[nextIndex]
    setForm({ itemDbKey: dbKey, apCost: 0, actionSubtype: undefined })
  }

  let description = ""
  if (actionType === "wait") {
    description = actions.wait.description
  }
  if (actionType === "prepare" && isKeyOf(actionSubtype, actions.prepare.subtypes)) {
    description = actions.prepare.subtypes[actionSubtype].description
  }

  if (description) return <Txt>{description}</Txt>
  if (actionType === "weapon" && itemDbKey) {
    return (
      <Pressable key={itemDbKey} onPress={toggleWeapon} disabled={weapons.length < 2}>
        <WeaponInfo selectedWeapon={itemDbKey} />
      </Pressable>
    )
  }
  if (actionType === "movement") return <MovementInfo />
  if (actionType === "item") return <ItemsActionInfo />
  if (actionType === "wait") return <Txt>{actions.wait.description}</Txt>
  return null
}
