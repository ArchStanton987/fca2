import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"

export default function ApInfo({ contenderId }: { contenderId?: string }) {
  const { charId } = useCharacter()
  const actorId = contenderId ?? charId
  const contender = useContenders(actorId)
  const { currAp } = useCombatStatuses(actorId)
  const { secAttr } = contender

  return (
    <Txt style={{ fontSize: 20 }}>
      {currAp} / {secAttr.curr.actionPoints}
    </Txt>
  )
}
