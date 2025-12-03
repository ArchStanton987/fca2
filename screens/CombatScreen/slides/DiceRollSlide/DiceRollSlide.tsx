import { useLocalSearchParams } from "expo-router"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import layout from "styles/layout"

import DiceRoll from "./DiceRollComponents"
import styles from "./DiceRollSlide.styles"

export default function DiceRollSlide({ slideIndex }: SlideProps) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { scrollTo } = useScrollTo()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId

  const { setRoll } = useActionApi()

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
    </DrawerSlide>
  )
}
