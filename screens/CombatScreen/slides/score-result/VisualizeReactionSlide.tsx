import { getActionScores } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCombat } from "providers/CombatProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

export default function VisualizeReactionSlide({
  dismiss,
  skipDamage
}: {
  dismiss: () => void
  skipDamage: () => void
}) {
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const scores = getActionScores(combat, contenders)
  if (scores === null) return <SlideError error={slideErrors.noDiceRollError} />
  if (!scores.opponentScores) return <SlideError error={slideErrors.noDiceRollError} />

  const { actorScores, opponentScores } = scores
  const { actorFinalScore, actorReactionScore } = actorScores
  const { opponentScore } = opponentScores
  const isSuccess = actorReactionScore > 0

  const onPressNext = () => {
    if (isSuccess) {
      dismiss()
      return
    }
    skipDamage()
  }

  return (
    <DrawerSlide>
      <Section
        title="scores réaction adversaire"
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: "center" }}
      >
        <Row style={{ alignItems: "flex-end", justifyContent: "center" }}>
          <Col style={styles.scoreContainer}>
            <Txt>Votre score</Txt>
            <Txt style={styles.score}>{actorFinalScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>-</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score adversaire</Txt>
            <Txt style={styles.score}>{opponentScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Résultat</Txt>
            <Txt style={styles.score}>{actorReactionScore}</Txt>
          </Col>
        </Row>
      </Section>

      <Spacer x={layout.globalPadding} />

      <Col>
        <Section
          title="résultat"
          style={{ flex: 1 }}
          contentContainerStyle={styles.centeredSection}
        >
          <ActionOutcome
            isCritFail={false}
            isCritSuccess={false}
            isCritHit={false}
            finalScore={actorReactionScore}
          />
        </Section>

        <Spacer y={layout.globalPadding} />
        <Section title="continuer" contentContainerStyle={{ alignItems: "center" }}>
          <NextButton onPress={() => onPressNext()} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
