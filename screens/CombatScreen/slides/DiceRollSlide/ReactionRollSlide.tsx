import skillsMap from "lib/character/abilities/skills/skills"
import { getReactionAbilities } from "lib/combat/utils/combat-utils"
import { reactionsRecord } from "lib/reaction/reactions.const"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import styles from "./DiceRollSlide.styles"

export default function ReactionRollSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const combat = useCombat()
  const char = useCharacter()
  const { charId } = char
  const combatStatus = useCombatStatus()
  const form = useReactionForm()
  const { diceRoll, reaction } = form
  const { setReactionRoll } = useReactionApi()

  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const diceScore = parseInt(diceRoll, 10)
  const isValid = diceRoll.length > 0 && !Number.isNaN(diceScore)

  if (reaction === "none") return <SlideError error={slideErrors.noDiceRollError} />
  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  const reactionAbilities = getReactionAbilities(char, combatStatus, combat)
  const { skillId, total } = reactionAbilities[reaction]
  const skillLabel = skillsMap[skillId].label

  const onPressConfirm = async () => {
    if (!isValid || !combat) return
    const reactionRoll = {
      opponentId: charId,
      opponentApCost: reactionsRecord[reaction].apCost,
      opponentDice: diceScore,
      opponentSumAbilities: total,
      opponentArmorClass: reactionAbilities.armorClass.total
    }
    await useCases.combat.updateAction({ combatId: combat.id, payload: { reactionRoll } })
    const newAp = combatStatus.currAp - reactionsRecord[reaction].apCost
    await useCases.character.updateCombatStatus({ charId, payload: { currAp: newAp } })
    scrollNext()
  }

  return (
    <DrawerSlide>
      <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={setReactionRoll} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1 }}>
        <Section
          style={{ flex: 1 }}
          title="JET DE DÉ"
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{diceRoll}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          style={{ flex: 1 }}
          title={skillLabel}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{total}</Txt>
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
