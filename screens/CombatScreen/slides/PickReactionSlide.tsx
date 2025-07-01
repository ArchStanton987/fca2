import { useState } from "react"
import { StyleSheet } from "react-native"

import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"

import Col from "components/Col"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import Selectable from "components/Selectable"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCharacter } from "contexts/CharacterContext"
import layout from "styles/layout"

import ApInfo from "./ActionTypeSlide/info/ApInfo"
import NextButton from "./NextButton"

const styles = StyleSheet.create({
  score: {
    fontSize: 20
  },
  centeredSection: {
    justifyContent: "center",
    alignItems: "center"
  }
})

// opposition slides
// recap () (HP, AP, PHY / CàC)
// => OUI / NON
// => ApAssignement
// => SkillScore
// => DiceRoll
// => DiceResult

const reactionsMap = {
  none: { id: "none", label: "Aucune" },
  parry: { id: "parry", label: "Parade" },
  dodge: { id: "dodge", label: "Esquive" }
} as const
const reactions = Object.values(reactionsMap)

export default function PickReactionSlide({ scrollNext }: SlideProps) {
  const { skills, equipedObjects, knowledgesRecord } = useCharacter()

  const [selectedReaction, setReaction] = useState<keyof typeof reactionsMap>("none")

  const dodgeKnowledgeBonus =
    knowledgeLevels.find(el => el.id === knowledgesRecord.kDodge)?.bonus ?? 0
  const parryKnowledgeBonus =
    knowledgeLevels.find(el => el.id === knowledgesRecord.kParry)?.bonus ?? 0

  const dodgeScore = skills.curr.physical + dodgeKnowledgeBonus
  const weaponSkill = equipedObjects.weapons[0].data.skillId
  const parryScore = skills.curr[weaponSkill] + parryKnowledgeBonus

  const onPressNext = () => {
    if (!scrollNext) throw new Error("scroll fn not provided")
    scrollNext()
  }

  return (
    <DrawerSlide>
      <Col style={{ flex: 1 }}>
        <Row>
          <Section title="PA">
            <ApInfo />
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section title="esquive">
            <Txt style={styles.score}>{dodgeScore}</Txt>
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section title="parade">
            <Txt style={styles.score}>{parryScore}</Txt>
          </Section>
        </Row>

        <Spacer y={layout.globalPadding} />

        <Row style={{ flex: 1 }}>
          <List
            horizontal
            data={reactions}
            keyExtractor={e => e.label}
            renderItem={({ item }) => (
              <Selectable
                isSelected={selectedReaction === item.id}
                onPress={() => setReaction(item.id)}
              >
                <Txt>{item.label}</Txt>
              </Selectable>
            )}
          />
        </Row>
      </Col>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 180 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <HealthFigure />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.centeredSection}>
          <NextButton size={45} onPress={onPressNext} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
