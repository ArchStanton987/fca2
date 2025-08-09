import { getRollFinalScore } from "lib/combat/utils/combat-utils"

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
  const { combat } = useCombat()

  const action = combat?.currAction
  if (!action?.roll || !action?.reactionRoll)
    return <SlideError error={slideErrors.noDiceRollError} />

  const actorScore = getRollFinalScore(action.roll)
  const { opponentDice, opponentSumAbilities } = action.reactionRoll
  const opponentScore = opponentSumAbilities - opponentDice
  const actorReactionScore = actorScore - opponentScore
  const actionHasFailed = actorReactionScore < 0

  const onPressNext = () => {
    if (actionHasFailed) {
      skipDamage()
    }
    dismiss()
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
            <Txt style={styles.score}>{actorScore}</Txt>
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
