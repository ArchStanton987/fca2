import Character from "lib/character/Character"
import { REACTION_MIN_AP_COST } from "lib/combat/const/combat-const"
import difficultyArray from "lib/combat/const/difficulty"
import {
  getActorSkillFromAction,
  getContenderAc,
  getRollBonus
} from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import AwaitGmSlide from "../wait-slides/AwaitGmSlide"
import styles from "./DiceRollSlide.styles"
import NoRollSlide from "./NoRollSlide"

export default function DiceRollSlide({ slideIndex }: SlideProps) {
  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const useCases = useGetUseCases()

  const char = useCharacter()
  const inventory = useInventory()
  const { weaponsRecord = {}, consumablesRecord = {} } = inventory
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const { setRoll } = useActionApi()
  const form = useActionForm()
  const { itemDbKey = "", targetId = "" } = form

  let item
  if (form.actionType === "weapon") {
    const isHuman = char instanceof Character
    if (itemDbKey) {
      item = isHuman
        ? weaponsRecord[itemDbKey] ?? char.unarmed
        : char.equipedObjectsRecord.weapons[itemDbKey]
    }
  } else {
    item = consumablesRecord[itemDbKey]
  }

  const { skillLabel, skillId, sumAbilities } = getActorSkillFromAction({ ...form, item }, char)

  const action = combat?.currAction
  if (!action) return <SlideError error={slideErrors.noCombatError} />
  if (action.roll === false) return <NoRollSlide />
  if (action.roll === undefined) return <AwaitGmSlide messageCase="difficulty" />
  const { difficulty } = action.roll
  if (typeof difficulty !== "number") return <AwaitGmSlide messageCase="difficulty" />

  const difficultyLvl = difficultyArray.find(e => difficulty <= e.threshold)

  const dice = form.actorDiceScore ? parseInt(form.actorDiceScore, 10) : 0
  const isValid = !Number.isNaN(dice) && dice > 0 && dice < 101

  const bonus = getRollBonus(char.charId, contenders, form)
  const targetArmorClass = getContenderAc(targetId, combat, contenders)

  const onPressConfirm = async () => {
    if (combat === null || !isValid) return
    let reactionRoll
    if (targetId) {
      const targetAp = contenders[targetId].char.status.currAp
      reactionRoll = targetAp >= REACTION_MIN_AP_COST ? undefined : (false as const)
    }
    const roll = { difficulty, sumAbilities, dice, bonus, targetArmorClass, skillId }
    await useCases.combat.updateAction({ combat, payload: { roll, reactionRoll } })
    scrollNext()
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
          <Txt style={styles.score}>{form.actorDiceScore}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          style={{ flex: 1 }}
          title={skillLabel}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{sumAbilities}</Txt>
        </Section>
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
