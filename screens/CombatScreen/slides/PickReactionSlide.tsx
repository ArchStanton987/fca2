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
import colors from "styles/colors"
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
  },
  selectable: {
    padding: 20
  },
  selected: {
    borderColor: colors.secColor
  }
})

// opposition slides
// recap () (HP, AP, PHY / CàC)
// => OUI / NON
// => SkillScore
// => DiceRoll
// => DiceResult

const reactionsMap = {
  none: { id: "none", label: "Aucune", apCost: 0 },
  parry: { id: "parry", label: "Parade", apCost: PARRY_AP_COST },
  dodge: { id: "dodge", label: "Esquive", apCost: DODGE_AP_COST }
} as const
const reactions = Object.values(reactionsMap)

export default function PickReactionSlide({ scrollNext }: SlideProps) {
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const char = useCharacter()
  const { skills, equipedObjects, knowledgesRecord, status, charId } = char

  const [selectedReaction, setReaction] = useState<keyof typeof reactionsMap>("none")

  const dodgeKBonus = knowledgeLevels.find(el => el.id === knowledgesRecord.kDodge)?.bonus ?? 0
  const parryKBonus = knowledgeLevels.find(el => el.id === knowledgesRecord.kParry)?.bonus ?? 0

  const dodgeScore = skills.curr.physical + dodgeKBonus
  const weaponSkill = equipedObjects.weapons[0].data.skillId
  const parryScore = skills.curr[weaponSkill] + parryKBonus

  const { apCost } = reactionsMap[selectedReaction]
  const leftAp = status.currAp - apCost

  const onPressNext = async () => {
    if (!scrollNext) throw new Error("scroll fn not provided")
    scrollNext()
  }

  return (
    <DrawerSlide>
      <Col style={{ flex: 1, alignItems: "stretch" }}>
        <Row>
          <Section style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center" }} title="PA">
            <Row>
              <Txt style={[styles.score, apCost > 0 && styles.prevScore]}>{leftAp}</Txt>
              <Txt style={styles.score}> / {status.currAp}</Txt>
            </Row>
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
            title="parade"
          >
            <Txt style={styles.score}>{parryScore}</Txt>
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
            title="esquive"
          >
            <Txt style={styles.score}>{dodgeScore}</Txt>
          </Section>
        </Row>

        <Spacer y={layout.globalPadding} />

        <Col style={{ flex: 1, justifyContent: "center", alignItems: "stretch" }}>
          <Txt style={{ textAlign: "center" }}>Choisissez une réaction : </Txt>
          <Spacer y={20} />
          <Row style={{ justifyContent: "center" }}>
            <List
              horizontal
              data={reactions}
              keyExtractor={e => e.label}
              style={{ alignItems: "center" }}
              renderItem={({ item }) => {
                const isSelected = selectedReaction === item.id
                return (
                  <Selectable
                    isSelected={isSelected}
                    onPress={() => setReaction(item.id)}
                    style={[styles.selectable, isSelected && styles.selected]}
                  >
                    <Txt style={styles.score}>{item.label}</Txt>
                  </Selectable>
                )
              }}
            />
          </Row>
        </Col>
      </Col>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 180 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <HealthFigure />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.centeredSection}>
          <NextButton size={45} onPress={onPressNext} disabled={leftAp < 0} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
