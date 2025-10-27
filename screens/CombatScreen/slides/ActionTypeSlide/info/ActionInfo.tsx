import actions from "lib/combat/const/actions"
import { CombatWeaponIndicator } from "lib/combat/ui/WeaponIndicator"

import Txt from "components/Txt"
import {
  useActionActorId,
  useActionItemDbKey,
  useActionSubtype,
  useActionType
} from "providers/ActionFormProvider"
import { isKeyOf } from "utils/ts-utils"

import ItemsActionInfo from "./ItemsActionInfo"
import MovementInfo from "./MovementInfo"

export default function ActionInfo({ charId }: { charId: string }) {
  const formActorId = useActionActorId()
  const itemDbKey = useActionItemDbKey()
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()

  const actorId = formActorId === "" ? charId : formActorId

  let description = ""
  if (actionType === "wait") {
    description = actions.wait.description
  }
  if (actionType === "prepare" && isKeyOf(actionSubtype, actions.prepare.subtypes)) {
    description = actions.prepare.subtypes[actionSubtype].description
  }

  if (description) return <Txt>{description}</Txt>
  if (actionType === "weapon" && itemDbKey) {
    return <CombatWeaponIndicator contenderId={actorId} />
  }
  if (actionType === "movement") return <MovementInfo charId={actorId} />
  if (actionType === "item") return <ItemsActionInfo actorId={actorId} />
  if (actionType === "wait") return <Txt>{actions.wait.description}</Txt>
  return null
}
