import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useFullname } from "lib/character/info/info-provider"

import Selectable from "components/Selectable"
import Txt from "components/Txt"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import charCombatStatusStyles from "styles/char-combat-status.styles"

export default function SelectActorButton({ charId }: { charId: string }) {
  const { data: fullname } = useFullname(charId)

  const { setActorId } = useActionApi()
  const actorId = useActionActorId()

  const toggleSelect = (id: string) => {
    setActorId(actorId === id ? "" : id)
  }

  const { data: status } = useCombatStatus(charId, s => ({
    combatStatus: s.combatStatus,
    currAp: s.currAp
  }))

  let statusStyleId: keyof typeof charCombatStatusStyles = "active"
  if (status.combatStatus === "dead") statusStyleId = "dead"
  if (status.combatStatus === "wait") statusStyleId = "wait"
  if (status.combatStatus === "inactive" || status.currAp === 0) statusStyleId = "done"

  return (
    <Selectable onPress={() => toggleSelect(charId)} isSelected={actorId === charId}>
      <Txt style={charCombatStatusStyles[statusStyleId]}>{fullname}</Txt>
    </Selectable>
  )
}
