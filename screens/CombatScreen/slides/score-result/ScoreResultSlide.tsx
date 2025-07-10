import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { limbsMap } from "lib/character/health/health"
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
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import AwaitGmSlide from "../wait-slides/AwaitGmSlide"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

type DiceResultSlideProps = SlideProps & {
  skillId: SkillId
}

export default function ScoreResultSlide({ skillId, scrollNext }: DiceResultSlideProps) {
  const useCases = useGetUseCases()
  const char = useCharacter()
  const { meta, charId, secAttr, special } = char
  const inv = useInventory()
  const { combat, npcs, players } = useCombat()
  const contenders = { ...players, ...npcs }
  const form = useActionForm()
  const { actionType, actionSubtype, targetId, aimZone } = form
  const { reset } = useActionApi()
  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  const action = combat.rounds?.[roundId]?.[actionId]
  const roll = action?.roll

  if (roll === undefined) return <AwaitGmSlide messageCase="difficulty" />
  if (roll === false) return <SlideError error={slideErrors.noDiceRollError} />

  let aimMalus = 0
  if (aimZone) {
    aimMalus = limbsMap[aimZone].aimBonus
  }
  const { actorDiceScore = 0, actorSkillScore = 0, difficultyModifier = 0 } = roll ?? {}
  const contenderType = meta.isNpc ? "npcs" : "players"
  const actionBonus = combat[contenderType][charId]?.actionBonus ?? 0

  let withAimCritChance = secAttr.curr.critChance
  if (actionType === "weapon" && aimZone) {
    withAimCritChance += limbsMap[aimZone].aimBonus
  }
  const isDefaultCritSuccess = actorDiceScore !== 0 && actorDiceScore <= secAttr.curr.critChance
  const isCritFail = actorDiceScore !== 0 && actorDiceScore >= getCritFailureThreshold(special.curr)

  const isAgainstAc = actionType === "weapon" || actionSubtype === "throw"
  let targetAc = 0
  if (isAgainstAc && typeof targetId === "string" && !!targetId && targetId !== "other") {
    targetAc = contenders?.[targetId].char.secAttr.curr.armorClass ?? 0
    const bonusAc = contenders?.[targetId]?.combatData?.acBonusRecord?.[roundId] ?? 0
    targetAc += bonusAc
  }
  const sumBonusMalus = actionBonus - aimMalus
  const score = actorSkillScore - actorDiceScore + sumBonusMalus
  const finalScore = score - targetAc - difficultyModifier
  const isCritHit = actorDiceScore <= withAimCritChance
  const isCrit = isCritHit || isDefaultCritSuccess
  const isSuccess = isDefaultCritSuccess || isCritHit || finalScore > 0

  const submit = async () => {
    const withDamageSubtypes = ["throw", "basic", "aim", "burst", "hit"]
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
              style={[styles.score, isCrit && styles.critSuccess, isCritFail && styles.critFail]}
            >
              {actorDiceScore}
            </Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>+</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Bonus / Malus</Txt>
            <Txt style={styles.score}>{sumBonusMalus}</Txt>
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
            <Txt style={styles.score}>{finalScore}</Txt>
          </Col>
        </Row>
      </Section>

      <Spacer x={layout.globalPadding} />
      <Col style={{ width: 100 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={styles.centeredSection}>
          <ActionOutcome
            isCritFail={isCritFail}
            isCritSuccess={isDefaultCritSuccess}
            isCritHit={isCritHit}
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
