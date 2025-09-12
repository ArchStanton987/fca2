import { router } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { getReactionAbilities, getRollBonus } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useCombatState } from "providers/CombatStateProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

export default function ReactionScoreResultSlide() {
  const char = useCharacter()
  const { secAttr, special } = char
  const combatStatuses = useCombatStatuses()
  const { diceRoll, reaction } = useReactionForm()
  const combat = useCombat()
  const { action } = useCombatState()
  const diceScore = parseInt(diceRoll, 10)
  const { reset } = useReactionApi()

  const roll = action?.roll
  const reactionRoll = action?.reactionRoll

  if (!action?.actorId || !combat) return <SlideError error={slideErrors.noCombatError} />
  if (reaction === "none") return <SlideError error={slideErrors.noDiceRollError} />
  if (diceScore === 0 || !roll || !reactionRoll)
    return <SlideError error={slideErrors.noDiceRollError} />

  const { sumAbilities, dice, bonus, targetArmorClass, difficulty } = roll
  const actorFinalScore = sumAbilities - dice + bonus - targetArmorClass - difficulty

  const { opponentSumAbilities, opponentDice, opponentId } = reactionRoll
  const opponentBonus = getRollBonus(combatStatuses[opponentId], action)
  const opponentScore = opponentSumAbilities - opponentDice + opponentBonus
  const isCritFail = opponentDice >= getCritFailureThreshold(special.curr)
  const isCrit = opponentDice < secAttr.curr.critChance
  const finalScore = opponentScore - actorFinalScore
  const isSuccess = finalScore >= 0

  const { skillId } = getReactionAbilities(char, combatStatuses[opponentId], combat)[reaction]

  const submit = () => {
    reset()
    router.replace(routes.combat.action)
  }

  return (
    <DrawerSlide>
      <Section title="scores" style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <Row style={styles.scoreDetailRow}>
          <Col style={styles.scoreContainer}>
            <Txt>Compétence</Txt>
            <Txt>{skillsMap[skillId].short}</Txt>
            <Txt style={styles.score}>{opponentSumAbilities}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>-</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Jet de dé</Txt>
            <Txt
              style={[styles.score, isCrit && styles.critSuccess, isCritFail && styles.critFail]}
            >
              {diceRoll}
            </Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>+</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Bonus / Malus</Txt>
            <Txt style={styles.score}>{opponentBonus}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score</Txt>
            <Txt style={styles.score}>{opponentScore}</Txt>
          </Col>
        </Row>

        <Spacer y={20} />

        <Row style={styles.scoreDetailRow}>
          <Col style={styles.scoreContainer}>
            <Txt>Score</Txt>
            <Txt style={styles.score}>{opponentScore}</Txt>
          </Col>

          <Spacer x={10} />

          <Txt style={styles.score}>-</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Adversaire</Txt>
            <Txt style={styles.score}>{actorFinalScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score final</Txt>
            <Txt style={styles.score}>{finalScore}</Txt>
          </Col>
        </Row>
      </Section>

      <Spacer x={layout.globalPadding} />
      <Col style={{ width: 100 }}>
        <Section
          title="résultat"
          style={{ flex: 1 }}
          contentContainerStyle={styles.centeredSection}
        >
          <ActionOutcome
            isCritFail={!isSuccess && isCritFail}
            isCritSuccess={isSuccess && isCrit}
            isCritHit={false}
            finalScore={finalScore}
          />
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          title="suivant"
          contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
        >
          <NextButton size={45} onPress={submit} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
