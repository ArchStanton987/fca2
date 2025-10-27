import { useActionType } from "providers/ActionFormProvider"

import ItemActions from "./ItemActions"
import MovementActions from "./MovementActions"
import OtherAction from "./OtherAction"
import PrepareActions from "./PrepareActions"
import SectionSpacer from "./SectionSpacer"
import WeaponActions from "./WeaponActions"

export default function SubActionList({ charId }: { charId: string }) {
  const actionType = useActionType()

  if (actionType === "weapon") return <WeaponActions charId={charId} />
  if (actionType === "movement") return <MovementActions charId={charId} />
  if (actionType === "item") return <ItemActions charId={charId} />
  if (actionType === "prepare") return <PrepareActions charId={charId} />
  if (actionType === "other") return <OtherAction />
  return <SectionSpacer />
}
