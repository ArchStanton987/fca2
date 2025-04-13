import { Pressable } from "react-native"

import actions from "lib/combat/const/actions"

import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { isKeyOf } from "utils/ts-utils"

import WeaponInfo from "../../WeaponInfo"
import ItemsActionInfo from "./ItemsActionInfo"

export default function ActionInfo() {
  const { equipedObjects, unarmed } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const { itemId, actionType, actionSubtype } = useActionForm()
  const { setForm } = useActionApi()

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const currentIndex = weapons.findIndex(w => w.dbKey === itemId)
    const nextIndex = (currentIndex + 1) % weapons.length
    setForm({ itemId: weapons[nextIndex].dbKey })
  }

  let description = ""
  if (actionType === "pause") {
    description = actions.pause.description
  }
  if (actionType === "prepare" && isKeyOf(actionSubtype, actions.prepare.subtypes)) {
    description = actions.prepare.subtypes[actionSubtype].description
  }

  if (description) return <Txt>{description}</Txt>
  if (actionType === "weapon" && itemId) {
    return (
      <Pressable onPress={toggleWeapon} disabled={weapons.length < 2}>
        <WeaponInfo selectedWeapon={itemId} />
      </Pressable>
    )
  }
  if (actionType === "movement") return <HealthFigure />
  if (actionType === "item") return <ItemsActionInfo />
  if (actionType === "pause") return <Txt>{actions.pause.description}</Txt>
  return null
}
