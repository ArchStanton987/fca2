import Character from "lib/character/Character"
import difficultyArray from "lib/combat/const/difficulty"
import { getDiceRollData, getItemWithSkillFromId } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
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
import styles from "./DiceRollSlide.styles"
import NoRollSlide from "./NoRollSlide"

type DiceRollSlideProps = {
  scrollNext?: () => void
}

export default function DiceRollSlide({ scrollNext }: DiceRollSlideProps) {
  const useCases = useGetUseCases()

  const char = useCharacter()
  const inventory = useInventory()
  const { combat } = useCombat()

  const { setRoll } = useActionApi()
  const form = useActionForm()

  let item
  if (form.actionType === "weapon") {
    item = char.unarmed
    const isHuman = char instanceof Character
    if (form.itemDbKey) {
      item = isHuman
        ? inventory.weaponsRecord[form.itemDbKey] ?? char.unarmed
        : char.equipedObjectsRecord.weapons[form.itemDbKey]
    }
  } else {
    item = getItemWithSkillFromId(form.itemDbKey, inventory)
  }

  const { skillLabel, totalSkillScore } = getDiceRollData({ ...form, item }, char)

  const action = combat?.currAction
  if (!action) return <SlideError error={slideErrors.noCombatError} />
  if (action.roll === false) return <NoRollSlide />
  if (action.roll === undefined) return <AwaitGmSlide messageCase="difficulty" />
  if (!action.roll.difficultyModifier) return <AwaitGmSlide messageCase="difficulty" />

  const difficultyScore = action.roll?.difficultyModifier ?? 0
  const difficultyLvl = difficultyArray.find(e => difficultyScore <= e.threshold)

  const actorDiceScore = parseInt(form.actorDiceScore, 10)
  const isValid = form.actorDiceScore.length > 0 && !Number.isNaN(actorDiceScore)
  const roll = { ...action.roll, actorDiceScore }

  const onPressConfirm = async () => {
    if (combat === null || !scrollNext || !isValid) return
    await useCases.combat.updateAction({ combat, payload: { roll } })
    scrollNext()
  }

  return (
    <DrawerSlide>
      <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={setRoll} />
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
          <Txt style={styles.score}>{totalSkillScore}</Txt>
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
