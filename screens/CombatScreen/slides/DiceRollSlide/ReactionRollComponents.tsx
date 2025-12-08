import { ReactNode } from "react"

import skillsMap from "lib/character/abilities/skills/skills"
import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useGetReactionAbilities } from "lib/combat/utils/combat-utils"
import { reactionsRecord } from "lib/reaction/reactions.const"

import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import Txt from "components/Txt"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

import NextButton from "../NextButton"
import styles from "./DiceRollSlide.styles"

type ReactionRollNextProps = {
  charId: string
  slideIndex: number
}

function Next({ slideIndex, charId }: ReactionRollNextProps) {
  const useCases = useGetUseCases()

  const { data: combatId } = useCombatId(charId)
  const { data: currAp } = useCombatStatus(charId, s => s.currAp)

  const form = useReactionForm()
  const { diceRoll, reaction } = form
  const diceScore = parseInt(diceRoll, 10)
  const isValid = diceRoll.length > 0 && !Number.isNaN(diceScore)

  const reactionAbilities = useGetReactionAbilities(charId)

  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const onPressConfirm = async () => {
    if (reaction === "none") return
    const { total } = reactionAbilities[reaction]
    if (!isValid) return
    const reactionRoll = {
      opponentId: charId,
      opponentApCost: reactionsRecord[reaction].apCost,
      opponentDice: diceScore,
      opponentSumAbilities: total,
      opponentArmorClass: reactionAbilities.armorClass.total
    }
    await useCases.combat.updateAction({ combatId, payload: { reactionRoll } })
    const newAp = currAp - reactionsRecord[reaction].apCost
    await useCases.character.updateCombatStatus({ charId, payload: { currAp: newAp } })
    scrollNext()
  }
  return <NextButton onPress={() => onPressConfirm()} size={55} disabled={!isValid} />
}

function useGetReaction(charId: string) {
  const form = useReactionForm()
  const reactionAbilities = useGetReactionAbilities(charId)
  if (form.reaction === "none") throw new Error("Can't get skill id of reaction when there is none")
  const { skillId, total } = reactionAbilities[form.reaction]
  return { skillId, total }
}

function ScoreSection({ children, charId }: { children: ReactNode; charId: string }) {
  const { skillId } = useGetReaction(charId)
  return (
    <Section
      style={{ flex: 1 }}
      title={skillsMap[skillId].label}
      contentContainerStyle={styles.scoreContainer}
    >
      {children}
    </Section>
  )
}

function Score({ charId }: { charId: string }) {
  const { total } = useGetReaction(charId)
  return <Txt style={styles.score}>{total}</Txt>
}

function ReactionNumPad() {
  const { setReactionRoll } = useReactionApi()
  return <NumPad onPressKeyPad={setReactionRoll} />
}

export default { Next, useGetReaction, ScoreSection, Score, ReactionNumPad }
