import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"

export default function ApInfo({ contenderId }: { contenderId?: string }) {
  const { charId } = useCharacter()
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const actorId = contenderId ?? charId
  const contender = contenders[actorId]
  const { currAp } = useCombatStatus(actorId)
  const { secAttr } = contender

  return (
    <Txt style={{ fontSize: 20 }}>
      {currAp} / {secAttr.curr.actionPoints}
    </Txt>
  )
}
