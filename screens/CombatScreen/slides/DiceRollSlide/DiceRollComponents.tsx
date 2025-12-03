import { ReactNode } from "react"

import Section from "components/Section"
import Txt from "components/Txt"
import { useActionSkill, useActorDiceScore } from "providers/ActionFormProvider"

import styles from "./DiceRollSlide.styles"

export function DiceScore() {
  const actorDiceScore = useActorDiceScore()

  return <Txt style={styles.score}>{actorDiceScore}</Txt>
}

export function SkillLabelSection({ actorId, children }: { actorId: string; children: ReactNode }) {
  const skill = useActionSkill(actorId)
  const label = skill ? skill.label : ""
  return (
    <Section style={{ flex: 1 }} title={label} contentContainerStyle={styles.scoreContainer}>
      {children}
    </Section>
  )
}

// export function SumAbilitiesScore({ actorId }: { actorId: string }) {
//   const skill = useActionSkill(actorId)
//   return (
//     <Txt style={styles.score}>{sumAbilities}</Txt>
//   )
// }

const DiceRoll = { DiceScore, SkillLabelSection }

export default DiceRoll
