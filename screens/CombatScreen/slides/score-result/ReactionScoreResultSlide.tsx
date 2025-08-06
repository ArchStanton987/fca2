import { router } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { getActionId, getCurrentRoundId, getReactionAbilities } from "lib/combat/utils/combat-utils"

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
  const { charId, secAttr, special } = char
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const { diceRoll, reaction } = useReactionForm()
  const diceScore = parseInt(diceRoll, 10)
  const { reset } = useReactionApi()

  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)

  const opponnentActionBonus = contenders?.[charId]?.combatData?.actionBonus ?? 0
  const oppononentAcBonus = contenders?.[charId]?.combatData?.acBonusRecord?.[roundId] ?? 0
  const opponentAc = secAttr.curr.armorClass + oppononentAcBonus

  const roll = combat?.rounds?.[roundId]?.[actionId]?.roll
  const action = combat?.rounds?.[roundId]?.[actionId]

  if (!combat || !action?.actorId) return <SlideError error={slideErrors.noCombatError} />
  if (reaction === "none") return <SlideError error={slideErrors.noDiceRollError} />
  if (diceScore === 0 || !roll) return <SlideError error={slideErrors.noDiceRollError} />

  const reactionAbilities = getReactionAbilities(char, contenders, combat)
  const { skillId, total, curr, knowledgeBonus, bonus } = reactionAbilities[reaction]
  const skillLabel = skillsMap[skillId].label

  // TODO: refactor with getActionScore()
  const { actorSkillScore = 0, actorDiceScore = 0, difficultyModifier } = roll
  const actorBonus = contenders?.[action.actorId]?.combatData?.actionBonus ?? 0
  const actorScore = actorSkillScore - actorDiceScore + actorBonus
  const actorFinalScore = actorScore - opponentAc - difficultyModifier

  const score = total - diceScore + opponnentActionBonus
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
            <Txt style={styles.score}>{opponnentActionBonus}</Txt>
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
