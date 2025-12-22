import Txt from "components/Txt"
import { useDamageRoll } from "providers/ActionFormProvider"

type DamageRollProps = {
  charId: string
}

export default function DamageRoll({ charId }: DamageRollProps) {
  const damageRoll = useDamageRoll(charId) ?? ""
  return <Txt style={{ fontSize: 36 }}>{damageRoll}</Txt>
}
