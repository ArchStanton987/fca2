import { useLocalSearchParams } from "expo-router"

import { useQuery } from "@tanstack/react-query"
import { useAbilities } from "lib/character/abilities/abilities-provider"
import {
  getCombatStatusOptions,
  useCombatId,
  useCombatStatus
} from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import { REACTION_MIN_AP_COST } from "lib/combat/const/combat-const"
import difficultyArray from "lib/combat/const/difficulty"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import {
  getActorSkillFromAction,
  getRollBonus,
  useContenderAc
} from "lib/combat/utils/combat-utils"
import { useItem } from "lib/inventory/use-sub-inv-cat"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionApi,
  useActionItemDbKey,
  useActionSubtype,
  useActionTargetId,
  useActionType,
  useActorDiceScore
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import AwaitGmSlide from "../wait-slides/AwaitGmSlide"
import DiceRoll, { SkillLabelSection } from "./DiceRollComponents"
import styles from "./DiceRollSlide.styles"
import NoRollSlide from "./NoRollSlide"

export default function DiceRollSlide({ slideIndex }: SlideProps) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  // const { scrollTo } = useScrollTo()

  // const scrollNext = () => {
  //   scrollTo(slideIndex + 1)
  // }

  // const useCases = useGetUseCases()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId, s => s.action)
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const targetId = useActionTargetId() ?? ""
  const itemDbKey = useActionItemDbKey() ?? ""
  const actorDiceScore = useActorDiceScore()

  const { data: combatStatus } = useCombatStatus(actorId)
  const { data: charInfo } = useCharInfo(actorId, i => ({
    isCritter: i.isCritter,
    templateId: i.templateId
  }))
  const { data: abilities } = useAbilities(actorId)
  // const { data: targetAp } = useCombatStatus(targetId, s => s.currAp)

  // const csReq = useQuery(getCombatStatusOptions(targetId))
  // console.log("target : ", targetId)

  // const targetArmorClass = useContenderAc(targetId)
  const { data: item } = useItem(actorId, itemDbKey)

  const { setRoll } = useActionApi()

  const o = { actionType, actionSubtype, item }
  const { skillLabel, skillId, sumAbilities } = getActorSkillFromAction(
    { ...o, item },
    abilities,
    charInfo
  )

  if (!action) return <SlideError error={slideErrors.noCombatError} />
  if (action.roll === false) return <NoRollSlide />
  if (action.roll === undefined) return <AwaitGmSlide messageCase="difficulty" />
  const { difficulty } = action.roll
  if (typeof difficulty !== "number") return <AwaitGmSlide messageCase="difficulty" />

  const difficultyLvl = difficultyArray.find(e => difficulty <= e.threshold)

  const dice = actorDiceScore ? parseInt(actorDiceScore, 10) : 0
  const isValid = !Number.isNaN(dice) && dice > 0 && dice < 101

  const bonus = getRollBonus(combatStatus, action)
  const onPressConfirm = async () => {
    // if (!isValid) return
    // let reactionRoll
    // if (targetId) {
    //   reactionRoll = targetAp >= REACTION_MIN_AP_COST ? undefined : (false as const)
    // }
    // const roll = { difficulty, sumAbilities, dice, bonus, targetArmorClass, skillId }
    // await useCases.combat.updateAction({ combatId, payload: { roll, reactionRoll } })
    // scrollNext()
  }

  const handlePad = (v: string) => {
    setRoll(v, "action")
  }

  return (
    <DrawerSlide>
      <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={handlePad} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1 }}>
        <Section
          style={{ flex: 1 }}
          title="JET DE DÉ"
          contentContainerStyle={styles.scoreContainer}
        >
          <DiceRoll.DiceScore />
        </Section>
        <Spacer y={layout.globalPadding} />
        <DiceRoll.SkillLabelSection actorId={actorId}>
          <Txt style={styles.score}>{sumAbilities}</Txt>
        </DiceRoll.SkillLabelSection>
      </Col>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1, minWidth: 100 }}>
        <Section
          title="difficulté"
          style={{ flex: 1 }}
          contentContainerStyle={styles.scoreContainer}
        >
          {difficultyLvl ? (
            <>
              <Txt style={{ fontSize: 22, color: difficultyLvl.color }}>{difficultyLvl.label}</Txt>
              <Spacer y={layout.globalPadding} />
              <Txt style={{ fontSize: 18, color: difficultyLvl.color }}>
                {difficultyLvl.modLabel}
              </Txt>
            </>
          ) : null}
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.scoreContainer}>
          <NextButton onPress={() => onPressConfirm()} size={55} disabled={!isValid} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
