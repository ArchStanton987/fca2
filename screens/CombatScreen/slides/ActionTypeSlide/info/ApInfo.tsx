import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"

import Txt from "components/Txt"

export default function ApInfo({ contenderId }: { contenderId: string }) {
  const { data: currAp } = useCombatStatus(contenderId, s => s.currAp)
  const { data: actionPoints } = useAbilities(contenderId, a => a.secAttr.curr.actionPoints)

  return (
    <Txt style={{ fontSize: 20 }}>
      {currAp} / {actionPoints}
    </Txt>
  )
}
