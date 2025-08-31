import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function ApInfo({ prevAp }: { prevAp?: number }) {
  const { status, secAttr } = useCharacter()

  const leftValue = typeof prevAp === "number" ? prevAp : status.currAp
  return (
    <Txt style={{ fontSize: 20 }}>
      {leftValue} / {secAttr.curr.actionPoints}
    </Txt>
  )
}
