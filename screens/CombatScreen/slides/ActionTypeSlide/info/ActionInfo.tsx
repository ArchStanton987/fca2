import actions from "lib/combat/const/actions"
import WeaponIndicator from "lib/combat/ui/WeaponIndicator"

import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionForm } from "providers/ActionProvider"
import { isKeyOf } from "utils/ts-utils"

import ItemsActionInfo from "./ItemsActionInfo"
import MovementInfo from "./MovementInfo"

export default function ActionInfo() {
  const { itemDbKey, actionType, actionSubtype, ...rest } = useActionForm()
  const { charId } = useCharacter()
  const actorId = rest.actorId === "" ? charId : rest.actorId

  let description = ""
  if (actionType === "wait") {
    description = actions.wait.description
  }
  if (actionType === "prepare" && isKeyOf(actionSubtype, actions.prepare.subtypes)) {
    description = actions.prepare.subtypes[actionSubtype].description
  }

  if (description) return <Txt>{description}</Txt>
  if (actionType === "weapon" && itemDbKey) {
    return <WeaponIndicator contenderId={actorId} />
  }
  if (actionType === "movement") return <MovementInfo />
  if (actionType === "item") return <ItemsActionInfo />
  if (actionType === "wait") return <Txt>{actions.wait.description}</Txt>
  return null
}
