import { StyleSheet } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { getActionId, getCurrentRoundId, getItemFromId } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import AwaitGmSlide from "./AwaitGmSlide"
import NextButton from "./NextButton"
import SlideError, { slideErrors } from "./SlideError"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scoreContainer: {
    alignItems: "center"
  },
  score: {
    fontSize: 35
  },
  finalScore: {
    fontSize: 45
  },
  scoreDetailRow: {
    justifyContent: "center",
    alignItems: "flex-end"
  },
  outcome: {
    textAlign: "center"
  },
  critSuccess: {
    color: colors.difficulty.veryEasy
  },
  critFail: {
    color: colors.difficulty.veryHard
  },
  success: {
    color: colors.difficulty.easy
  },
  fail: {
    color: colors.difficulty.hard
  }
})

function Outcome({
  isCritSuccess,
  isCritFail,
  finalScore
}: {
  finalScore: number
  isCritSuccess: boolean
  isCritFail: boolean
}) {
  if (isCritSuccess) {
    return <Txt style={[styles.outcome, styles.critSuccess]}>Réussite critique !</Txt>
  }
  if (isCritFail) {
    return <Txt style={[styles.outcome, styles.critFail]}>Échec critique !</Txt>
  }
  return (
    <Txt style={[styles.outcome, finalScore > 0 ? styles.success : styles.fail]}>
      {finalScore > 0 ? "Réussite !" : "Échec"}
    </Txt>
  )
}

type DiceResultSlideProps = SlideProps & {
  skillId: SkillId
}

export default function DiceResultSlide({ skillId, scrollNext }: DiceResultSlideProps) {
  const useCases = useGetUseCases()
  const { meta, charId, secAttr, special } = useCharacter()
  const inv = useInventory()
  const { combat, npcs, players } = useCombat()
  const contenders = { ...players, ...npcs }
  const form = useActionForm()
  const { actionType, actionSubtype, targetId } = form
  const { reset } = useActionApi()
  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  const roll = combat.rounds?.[roundId]?.[actionId]?.roll

  if (roll === undefined) return <AwaitGmSlide messageCase="difficulty" />
  if (roll === false) return <SlideError error={slideErrors.noDiceRollError} />

  const { actorDiceScore = 0, actorSkillScore = 0, difficultyModifier = 0 } = roll ?? {}
  const contenderType = meta.isNpc ? "npcs" : "players"
  const actionBonus = combat[contenderType][charId]?.actionBonus ?? 0

  const isCritSuccess = actorDiceScore !== 0 && actorDiceScore <= secAttr.curr.critChance
  const isCritFail = actorDiceScore !== 0 && actorDiceScore >= getCritFailureThreshold(special.curr)

  const isAgainstAc = actionType === "weapon" || actionSubtype === "throw"
  let targetAc = 0
  if (isAgainstAc && typeof targetId === "string" && !!targetId && targetId !== "other") {
    targetAc = contenders?.[targetId].char.secAttr.curr.armorClass ?? 0
    const bonusAc = contenders?.[targetId]?.combatData?.acBonusRecord?.[roundId] ?? 0
    targetAc += bonusAc
  }
  const score = actorSkillScore - actorDiceScore + actionBonus
  const finalScore = score - targetAc - difficultyModifier
  const isSuccess = isCritSuccess || finalScore > 0

  const submit = async () => {
    const withDamageSubtypes = ["throw", "basic", "aim", "burst"]
    const hasNextSlide = withDamageSubtypes.includes(actionSubtype) && isSuccess
    if (hasNextSlide) {
      if (!scrollNext) throw new Error("invalid scrollNext")
      scrollNext()
      return
    }
    try {
      const item = getItemFromId(inv, form.itemDbKey)
      const actionPayload = { combat, contenders, action: form, item }
      await useCases.combat.doCombatAction(actionPayload)
      Toast.show({ type: "custom", text1: "Action réalisée !" })
      reset()
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  return (
    <DrawerSlide>
      <Section title="résultats" style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <Row style={styles.scoreDetailRow}>
          <Col style={styles.scoreContainer}>
            <Txt>Compétence</Txt>
            <Txt>{skillsMap[skillId].label}</Txt>
            <Txt style={styles.score}>{actorSkillScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>-</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Jet de dé</Txt>
            <Txt
              style={[
                styles.score,
                isCritSuccess && styles.critSuccess,
                isCritFail && styles.critFail
              ]}
            >
              {actorDiceScore}
            </Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>+</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Bonus / Malus</Txt>
            <Txt style={styles.score}>{actionBonus}</Txt>
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

          {targetAc !== 0 ? (
            <>
              <Txt style={styles.score}>-</Txt>
              <Spacer x={10} />
              <Col style={styles.scoreContainer}>
                <Txt>CA</Txt>
                <Txt style={styles.score}>{targetAc}</Txt>
              </Col>
              <Spacer x={10} />
            </>
          ) : null}

          <Txt style={styles.score}>+</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Difficulté</Txt>
            <Txt style={styles.score}>{difficultyModifier}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score final</Txt>
            <Txt style={styles.finalScore}>{finalScore}</Txt>
          </Col>
        </Row>
      </Section>

      <Spacer x={layout.globalPadding} />
      <Col style={{ width: 100 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={styles.centeredSection}>
          <Outcome isCritFail={isCritFail} isCritSuccess={isCritSuccess} finalScore={finalScore} />
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section title="suivant" contentContainerStyle={styles.centeredSection}>
          <NextButton size={45} onPress={submit} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
