import { useAbilities } from "lib/character/abilities/abilities-provider"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

export default function MovementInfo({ charId }: { charId: string }) {
  const { data: physical } = useAbilities(charId, a => a.skills.curr.physical)

  return (
    <>
      <Txt>Physique : {physical}</Txt>
      <Spacer y={15} />
      <Txt>Les distances indiquées sont approximatives.</Txt>
      <Txt>
        Si l&apos;action se fait dans des conditions difficiles (menace, terrain difficile), un jet
        de physique peut-être requis.{" "}
      </Txt>
      <Txt>
        Selon le contexte et le résultat d&apos;un éventuel jet de physique, il sera possible de
        couvrir plus ou moins de distance.
      </Txt>
    </>
  )
}
