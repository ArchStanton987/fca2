import { useAbilities, useSpecial } from "lib/character/abilities/abilities-provider"
import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { limbsMap } from "lib/character/health/Health"
import { useCharInfo } from "lib/character/info/info-provider"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { getActorSkillFromAction } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionAimZone,
  useActionApi,
  useActionItem,
  useActionItemDbKey,
  useActionSubtype,
  useActionType
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import AwaitGmSlide from "../wait-slides/AwaitGmSlide"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

export default function ScoreResultSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()
  const useCases = useGetUseCases()

  const itemDbKey = useActionItemDbKey() ?? ""
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const aimZone = useActionAimZone()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId, s => s.action)
  const { data: abilities } = useAbilities(actorId)
  const { data: critChance } = useAbilities(actorId, a => a.secAttr.curr.critChance)
  const { data: charInfo } = useCharInfo(actorId, i => ({
    templateId: i.templateId,
    isCritter: i.isCritter
  }))
  const item = useActionItem(actorId, itemDbKey)
  const { data: special } = useSpecial(actorId)

  const { reset } = useActionApi()

  const { scrollTo } = useScrollTo()

  if (!action) return <SlideError error={slideErrors.noCombatError} />
  if (action.roll === undefined) return <AwaitGmSlide messageCase="difficulty" />
  if (action.roll === false) return <SlideError error={slideErrors.noDiceRollError} />

  const {
    dice = 0,
    sumAbilities = 0,
    difficulty = 0,
    bonus = 0,
    targetArmorClass = 0
  } = action.roll

  let withAimCritChance = critChance
  if (actionType === "weapon" && aimZone) {
    withAimCritChance += limbsMap[aimZone].aim.aimMalus
  }

  const o = { actionType, actionSubtype, item }
  const { skillLabel } = getActorSkillFromAction({ ...o }, abilities, charInfo)

  const isDefaultCritSuccess = dice !== 0 && dice <= critChance
  const isCritFail = dice !== 0 && dice >= getCritFailureThreshold(special.curr)
  const score = sumAbilities - dice + bonus
  const finalScore = score - targetArmorClass - difficulty
  const isSuccess = isDefaultCritSuccess || finalScore > 0
  const isCritHit = finalScore > 0 && dice <= withAimCritChance
  const isCrit = isCritHit || isDefaultCritSuccess

  const submit = async () => {
    const withDamageSubtypes = ["throw", "basic", "aim", "burst", "hit"]
    const hasNextSlide = withDamageSubtypes.includes(actionSubtype) && isSuccess
    if (hasNextSlide) {
      scrollTo(slideIndex + 1)
      return
    }
    try {
      await useCases.combat.doCombatAction({ combatId, action, item })
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
            <Txt>{skillLabel}</Txt>
            <Txt style={styles.score}>{sumAbilities}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>-</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Jet de dé</Txt>
            <Txt
              style={[styles.score, isCrit && styles.critSuccess, isCritFail && styles.critFail]}
            >
              {dice}
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

          {targetArmorClass !== 0 ? (
            <>
              <Txt style={styles.score}>-</Txt>
              <Spacer x={10} />
              <Col style={styles.scoreContainer}>
                <Txt>CA</Txt>
                <Txt style={styles.score}>{targetArmorClass}</Txt>
              </Col>
              <Spacer x={10} />
            </>
          ) : null}

          <Txt style={styles.score}>{difficulty > 0 ? "-" : "+"}</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Difficulté</Txt>
            <Txt style={styles.score}>{Math.abs(difficulty)}</Txt>
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
