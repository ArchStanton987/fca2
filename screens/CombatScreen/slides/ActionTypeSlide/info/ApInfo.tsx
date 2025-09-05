import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"

export default function ApInfo({ contenderId }: { contenderId?: string }) {
  const { charId } = useCharacter()
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const actorId = contenderId ?? charId
  const contender = contenders[actorId]
  const { status, secAttr } = contender.char

  return (
    <Txt style={{ fontSize: 20 }}>
      {status.currAp} / {secAttr.curr.actionPoints}
    </Txt>
  )
}
