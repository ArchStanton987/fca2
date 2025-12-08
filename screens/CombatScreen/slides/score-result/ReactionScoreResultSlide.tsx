import { ReactNode } from "react"

import { router, useLocalSearchParams } from "expo-router"

import { useAbilities, useSpecial } from "lib/character/abilities/abilities-provider"
import skillsMap from "lib/character/abilities/skills/skills"
import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { getRollBonus } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import { useSetSliderIndex } from "providers/SlidesProvider"
import ReactionRoll from "screens/CombatScreen/slides/DiceRollSlide/ReactionRollComponents"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

function ReactionWrapper({ children }: { children: ReactNode }) {
  const form = useReactionForm()
  if (form.reaction === "none") {
    return (
      <Section contentContainerStyle={styles.scoreContainer}>
        <Txt>Pas de réaction sélectionnée</Txt>
      </Section>
    )
  }
  return children
}

function Skill({ charId }: { charId: string }) {
  const { skillId } = ReactionRoll.useGetReaction(charId)
  return <Txt>{skillsMap[skillId].short}</Txt>
}

export default function ReactionScoreResultSlide() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const { data: special } = useSpecial(charId)
  const { data: critChance } = useAbilities(charId, a => a.secAttr.curr.critChance)

  const { data: combatId } = useCombatId(charId)
  const { diceRoll, reaction } = useReactionForm()
  const { data: action } = useCombatState(combatId, s => s.action)
  const { data: opponentCombatStatus } = useCombatStatus(charId)

  const diceScore = parseInt(diceRoll, 10)
  const { reset } = useReactionApi()
  const setSlideIndex = useSetSliderIndex()

  const roll = action?.roll
  const reactionRoll = action?.reactionRoll

  if (reaction === "none") return <SlideError error={slideErrors.noDiceRollError} />
  if (diceScore === 0 || !roll || !reactionRoll)
    return <SlideError error={slideErrors.noDiceRollError} />

  const { sumAbilities, dice, bonus, targetArmorClass, difficulty } = roll
  const actorFinalScore = sumAbilities - dice + bonus - targetArmorClass - difficulty

  const { opponentSumAbilities, opponentDice } = reactionRoll
  const opponentBonus = getRollBonus(opponentCombatStatus, action)
  const opponentScore = opponentSumAbilities - opponentDice + opponentBonus
  const isCritFail = opponentDice >= getCritFailureThreshold(special.curr)
  const isCrit = opponentDice < critChance
  const finalScore = opponentScore - actorFinalScore
  const isSuccess = finalScore >= 0

  const submit = () => {
    setSlideIndex("reactionSlider", 0)
    reset()
    router.replace(routes.combat.action)
  }

  return (
    <DrawerSlide>
      <ReactionWrapper>
        <Section title="scores" style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <Row style={styles.scoreDetailRow}>
            <Col style={styles.scoreContainer}>
              <Txt>Compétence</Txt>
              <Skill charId={charId} />
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
      </ReactionWrapper>
    </DrawerSlide>
  )
}
