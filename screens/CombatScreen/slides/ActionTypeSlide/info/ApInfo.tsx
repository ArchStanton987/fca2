import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function ApInfo() {
  const { status, secAttr } = useCharacter()

  return (
    <Txt style={{ fontSize: 20 }}>
      {status.currAp} / {secAttr.curr.actionPoints}
    </Txt>
  )
}
