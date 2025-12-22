import { ReactNode, memo } from "react"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import layout from "styles/layout"

import AwaitGmSlide from "../wait-slides/AwaitGmSlide"
import DiceRoll from "./DiceRollComponents"
import styles from "./DiceRollSlide.styles"
import NoRollSlide from "./NoRollSlide"

function DifficultyReadyWrapper({ children, actorId }: { children: ReactNode; actorId: string }) {
  const { data: combatId } = useCombatId(actorId)
  const { data: combatState } = useCombatState(combatId, cs => ({
    hasDifficulty: cs.action.roll ? typeof cs.action.roll?.difficulty === "number" : false,
    shouldNotRoll: cs.action.roll === false
  }))
  const { hasDifficulty, shouldNotRoll } = combatState
  if (shouldNotRoll) return <NoRollSlide />
  if (!hasDifficulty) return <AwaitGmSlide messageCase="difficulty" />
  return children
}

function DiceRollSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()
  const { scrollTo } = useScrollTo()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId

  const { setRoll } = useActionApi()

  const handlePad = (v: string) => {
    setRoll(v, "actorDiceScore")
  }

  return (
    <DrawerSlide>
      <DifficultyReadyWrapper actorId={actorId}>
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
            <DiceRoll.AbilitiesScore actorId={actorId} />
          </DiceRoll.SkillLabelSection>
        </Col>

        <Spacer x={layout.globalPadding} />

        <Col style={{ flex: 1, minWidth: 100 }}>
          <Section
            title="difficulté"
            style={{ flex: 1 }}
            contentContainerStyle={styles.scoreContainer}
          >
            <DiceRoll.Difficulty actorId={actorId} />
          </Section>
          <Spacer y={layout.globalPadding} />

          <Section title="valider" contentContainerStyle={styles.scoreContainer}>
            <DiceRoll.Submit actorId={actorId} onSubmit={() => scrollTo(slideIndex + 1)} />
          </Section>
        </Col>
      </DifficultyReadyWrapper>
    </DrawerSlide>
  )
}

export default memo(DiceRollSlide)
