import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombatStatus } from "providers/CombatStatusProvider"

export default function ApInfo({ prevAp }: { prevAp?: number }) {
  const { charId, secAttr } = useCharacter()
  const { currAp } = useCombatStatus(charId)

  const leftValue = typeof prevAp === "number" ? prevAp : currAp
  return (
    <Txt style={{ fontSize: 20 }}>
      {leftValue} / {secAttr.curr.actionPoints}
    </Txt>
  )
}
