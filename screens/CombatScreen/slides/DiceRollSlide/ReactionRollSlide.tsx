import { ReactNode } from "react"

import { useCurrCharId } from "lib/character/character-store"

import Col from "components/Col"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useReactionForm } from "providers/ReactionProvider"
import layout from "styles/layout"

import styles from "./DiceRollSlide.styles"
import Reaction from "./ReactionRollComponents"

function ReactionWrapper({ children }: { children: ReactNode }) {
  const form = useReactionForm()
  if (form.reaction === "none") {
    return (
      <Section contentContainerStyle={styles.scoreContainer}>
        <Txt>Pas de réaction sélectionnée</Txt>
      </Section>
    )
  }
  return children
}

export default function ReactionRollSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()

  const form = useReactionForm()
  const { diceRoll } = form

  return (
    <DrawerSlide>
      <ReactionWrapper>
        <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
          <Reaction.ReactionNumPad />
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
          <Reaction.ScoreSection charId={charId}>
            <Reaction.Score charId={charId} />
          </Reaction.ScoreSection>
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
      </ReactionWrapper>
    </DrawerSlide>
  )
}
