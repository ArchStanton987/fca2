import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionActorId } from "providers/ActionFormProvider"
import { useContenders } from "providers/ContendersProvider"

export default function MovementInfo() {
  const { charId } = useCharacter()
  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { skills } = useContenders(actorId)

  return (
    <>
      <Txt>Physique : {skills.curr.physical}</Txt>
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
