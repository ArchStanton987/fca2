import { ReactNode } from "react"

import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import difficultyArray from "lib/combat/const/difficulty"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { getRollBonus } from "lib/combat/utils/combat-utils"

import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionSkill,
  useActionSkillScore,
  useActorDiceScore
} from "providers/ActionFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import styles from "./DiceRollSlide.styles"

function DiceScore() {
  const actorDiceScore = useActorDiceScore()
  return <Txt style={styles.score}>{actorDiceScore}</Txt>
}

function SkillLabelSection({ actorId, children }: { actorId: string; children: ReactNode }) {
  const skill = useActionSkill(actorId)
  const label = skill ? skill.label : ""
  return (
    <Section style={{ flex: 1 }} title={label} contentContainerStyle={styles.scoreContainer}>
      {children}
    </Section>
  )
}

function AbilitiesScore({ actorId }: { actorId: string }) {
  const score = useActionSkillScore(actorId)
  return <Txt style={styles.score}>{score}</Txt>
}

function Difficulty({ actorId }: { actorId: string }) {
  const { data: combatId } = useCombatId(actorId)
  const { data: difficulty } = useCombatState(combatId, cs =>
    cs.action.roll ? cs.action.roll.difficulty : null
  )
  const difficultyLvl = difficultyArray.find(e =>
    difficulty === null ? false : difficulty <= e.threshold
  )
  if (!difficultyLvl) return null
  return (
    <>
      <Txt style={{ fontSize: 22, color: difficultyLvl.color }}>{difficultyLvl.label}</Txt>
      <Spacer y={layout.globalPadding} />
      <Txt style={{ fontSize: 18, color: difficultyLvl.color }}>{difficultyLvl.modLabel}</Txt>
    </>
  )
}

function Submit({ actorId, onSubmit }: { actorId: string; onSubmit: () => void }) {
  const useCases = useGetUseCases()

  const { data: combatId } = useCombatId(actorId)
  const { data: combatStatus } = useCombatStatus(actorId)
  const actorDiceScore = useActorDiceScore()
  const {
    data: { action, difficulty }
  } = useCombatState(combatId, cs => ({
    difficulty: cs.action.roll ? cs.action.roll.difficulty : 0,
    action: cs.action
  }))

  const bonus = getRollBonus(combatStatus, action)
  const skillId = useActionSkill(actorId)
  const sumAbilities = useActionSkillScore(actorId)

  const dice = actorDiceScore ? parseInt(actorDiceScore, 10) : 0
  const isValid = !Number.isNaN(dice) && dice > 0 && dice < 101

  const onPressConfirm = async () => {
    if (!isValid) return
    const roll = {
      difficulty,
      sumAbilities,
      dice,
      bonus,
      skillId
    }
    await useCases.combat.updateRoll({ combatId, payload: { ...roll } })
    onSubmit()
  }
  return <NextButton onPress={() => onPressConfirm()} size={55} disabled={!isValid} />
}

const DiceRoll = { DiceScore, SkillLabelSection, AbilitiesScore, Difficulty, Submit }

export default DiceRoll
