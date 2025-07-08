import skillsMap from "lib/character/abilities/skills/skills"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCombat } from "providers/CombatProvider"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import styles from "./DiceRollSlide.styles"

export default function ReactionRollSlide({ scrollNext }: SlideProps) {
  const { combat } = useCombat()
  const form = useReactionForm()
  const { diceRoll, skillScore, skillId } = form
  const { setReactionForm, submit } = useReactionApi()
  const initValue = diceRoll === 0 ? "" : diceRoll.toString()

  const { scoreStr, onPressKeypad } = useNumPad(initValue)
  const skillLabel = skillId ? skillsMap[skillId].label : "Compétence"

  const diceScore = parseInt(scoreStr, 10)
  const isValid = scoreStr.length > 0 && !Number.isNaN(diceScore)

  const onPressConfirm = async () => {
    if (!scrollNext || isValid || !combat) return
    setReactionForm({ diceRoll: diceScore })
    await submit({ ...form, diceRoll }, combat)
    scrollNext()
  }

  return (
    <DrawerSlide>
      <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={onPressKeypad} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1 }}>
        <Section
          style={{ flex: 1 }}
          title="JET DE DÉ"
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{scoreStr}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          style={{ flex: 1 }}
          title={skillLabel}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{skillScore}</Txt>
        </Section>
      </Col>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1, minWidth: 100 }}>
        <Section
          title="difficulté"
          style={{ flex: 1 }}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={{ textAlign: "center" }}>Jet en opposition au score de l&apos;ennemi</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.scoreContainer}>
          <NextButton onPress={() => onPressConfirm()} size={55} disabled={!isValid} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
