import { useLocalSearchParams } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import layout from "styles/layout"

import styles from "./DiceRollSlide.styles"
import Reaction from "./ReactionRollComponents"

export default function ReactionRollSlide({ slideIndex }: SlideProps) {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const form = useReactionForm()
  const { diceRoll } = form
  const { setReactionRoll } = useReactionApi()

  const { skillId, total } = Reaction.useGetReaction(charId)

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
          title={skillsMap[skillId].label}
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
          <Reaction.Next charId={charId} slideIndex={slideIndex} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
