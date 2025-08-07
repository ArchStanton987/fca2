import { router } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { getActionScores, getReactionAbilities } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

export default function ReactionScoreResultSlide() {
  const char = useCharacter()
  const { secAttr, special } = char
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const { diceRoll, reaction } = useReactionForm()
  const diceScore = parseInt(diceRoll, 10)
  const { reset } = useReactionApi()

  const action = combat?.currAction
  const roll = action?.roll

  if (!combat || !action?.actorId) return <SlideError error={slideErrors.noCombatError} />
  if (reaction === "none") return <SlideError error={slideErrors.noDiceRollError} />
  if (diceScore === 0 || !roll) return <SlideError error={slideErrors.noDiceRollError} />

  const reactionAbilities = getReactionAbilities(char, contenders, combat)
  const { skillId, total, curr, knowledgeBonus, bonus } = reactionAbilities[reaction]
  const skillLabel = skillsMap[skillId].label

  const scores = getActionScores(combat, contenders)
  const actorFinalScore = scores?.actorScores?.actorFinalScore ?? 0

  const score = total - diceScore + bonus
  const isCritFail = diceScore >= getCritFailureThreshold(special.curr)
  const isCrit = diceScore < secAttr.curr.critChance
  const finalScore = score - actorFinalScore
  const isSuccess = finalScore >= 0

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
            <Txt>{skillLabel}</Txt>
            <Txt style={styles.score}>{curr + knowledgeBonus}</Txt>
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
            <Txt style={styles.score}>{bonus}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score</Txt>
            <Txt style={styles.score}>{score}</Txt>
          </Col>
        </Row>

        <Spacer y={20} />

        <Row style={styles.scoreDetailRow}>
          <Col style={styles.scoreContainer}>
            <Txt>Score</Txt>
            <Txt style={styles.score}>{score}</Txt>
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
