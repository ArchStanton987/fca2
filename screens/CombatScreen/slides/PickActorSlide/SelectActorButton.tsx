import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"

import Selectable from "components/Selectable"
import Txt from "components/Txt"
import charCombatStatusStyles from "styles/char-combat-status.styles"

export default function SelectActorButton({
  charId,
  fullname,
  isSelected,
  toggleSelect
}: {
  charId: string
  fullname: string
  isSelected: boolean
  toggleSelect: (id: string) => void
}) {
  const { data: status } = useCombatStatus(charId, s => ({
    combatStatus: s.combatStatus,
    currAp: s.currAp
  }))

  let statusStyleId: keyof typeof charCombatStatusStyles = "active"
  if (status.combatStatus === "dead") statusStyleId = "dead"
  if (status.combatStatus === "wait") statusStyleId = "wait"
  if (status.combatStatus === "inactive" || status.currAp === 0) statusStyleId = "done"

  return (
    <Selectable onPress={() => toggleSelect(charId)} isSelected={isSelected}>
      <Txt style={charCombatStatusStyles[statusStyleId]}>{fullname}</Txt>
    </Selectable>
  )
}
