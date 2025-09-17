import Selectable from "components/Selectable"
import Txt from "components/Txt"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
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
  const combatStatuses = useCombatStatuses()
  const { combatStatus = "active", currAp = 0 } = combatStatuses[charId]

  let statusStyleId: keyof typeof charCombatStatusStyles = "active"
  if (combatStatus === "dead") statusStyleId = "dead"
  if (combatStatus === "wait") statusStyleId = "wait"
  if (combatStatus === "inactive" || currAp === 0) statusStyleId = "done"

  return (
    <Selectable onPress={() => toggleSelect(charId)} isSelected={isSelected}>
      <Txt style={charCombatStatusStyles[statusStyleId]}>{fullname}</Txt>
    </Selectable>
  )
}
