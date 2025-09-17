import { useActionType } from "providers/ActionFormProvider"

import ItemActions from "./ItemActions"
import MovementActions from "./MovementActions"
import OtherAction from "./OtherAction"
import PrepareActions from "./PrepareActions"
import SectionSpacer from "./SectionSpacer"
import WeaponActions from "./WeaponActions"

export default function SubActionList() {
  const actionType = useActionType()

  if (actionType === "weapon") return <WeaponActions />
  if (actionType === "movement") return <MovementActions />
  if (actionType === "item") return <ItemActions />
  if (actionType === "prepare") return <PrepareActions />
  if (actionType === "other") return <OtherAction />
  return <SectionSpacer />
}
