import Character from "lib/character/Character"
import { limbsMap } from "lib/character/health/health"
import { getCritFailureThreshold } from "lib/combat/const/crit"
import { getActorSkillFromAction } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatState } from "providers/CombatStateProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"
import { useInventories } from "providers/InventoriesProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import AwaitGmSlide from "../wait-slides/AwaitGmSlide"
import ActionOutcome from "./ActionOutcome"
import styles from "./ScoreResultSlide.styles"

export default function ScoreResultSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const combat = useCombat()
  const contenders = useContenders()
  const combatStatuses = useCombatStatuses()
  const { action } = useCombatState()

  const character = useCharacter()
  const form = useActionForm()
  const actorId = form.actorId === "" ? character.charId : form.actorId
  const actor = contenders[actorId]
  const inv = useInventories(actorId)
  const { weaponsRecord = {}, consumablesRecord = {} } = inv
  const { secAttr, special } = actor
  const { itemDbKey = "" } = form
  const { actionType, actionSubtype, aimZone } = form
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

  let withAimCritChance = secAttr.curr.critChance
  if (actionType === "weapon" && aimZone) {
    withAimCritChance += limbsMap[aimZone].aimMalus
  }

  let obj
  if (form.actionType === "weapon") {
    const isHuman = actor instanceof Character
    if (itemDbKey) {
      obj = isHuman
        ? weaponsRecord[itemDbKey] ?? actor.unarmed
        : actor.equipedObjectsRecord.weapons[itemDbKey]
    }
  } else {
    obj = consumablesRecord[itemDbKey]
  }
  const { skillLabel } = getActorSkillFromAction({ ...form, item: obj }, actor)

  const isDefaultCritSuccess = dice !== 0 && dice <= secAttr.curr.critChance
  const isCritFail = dice !== 0 && dice >= getCritFailureThreshold(special.curr)
  const score = sumAbilities - dice + bonus
  const finalScore = score - targetArmorClass - difficulty
  const isSuccess = isDefaultCritSuccess || finalScore > 0
  const isCritHit = finalScore > 0 && dice <= withAimCritChance
  const isCrit = isCritHit || isDefaultCritSuccess

  const submit = async () => {
    if (!combat) return
    const withDamageSubtypes = ["throw", "basic", "aim", "burst", "hit"]
    const hasNextSlide = withDamageSubtypes.includes(actionSubtype) && isSuccess
    if (hasNextSlide) {
      scrollTo(slideIndex + 1)
      return
    }
    try {
      const item = action.itemDbKey ? inv.allItems[action.itemDbKey] : undefined
      await useCases.combat.doCombatAction({
        combat,
        contenders,
        combatStatuses,
        action,
        item
      })
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
