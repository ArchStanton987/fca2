import { StyleSheet } from "react-native"

import { router } from "expo-router"

import { getReactionAbilities } from "lib/combat/utils/combat-utils"
import { reactions, reactionsRecord } from "lib/reaction/reactions.const"

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
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "./NextButton"
import PlayButton from "./PlayButton"
import SlideError, { slideErrors } from "./SlideError"

const styles = StyleSheet.create({
  score: {
    fontSize: 20
  },
  prevScore: {
    color: colors.yellow
  },
  centeredSection: {
    justifyContent: "center",
    alignItems: "center"
  },
  selectable: {
    padding: 20,
    borderColor: colors.terColor
  },
  selected: {
    borderColor: colors.secColor
  }
})

export default function PickReactionSlide({ scrollNext }: SlideProps) {
  const useCases = useGetUseCases()
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const char = useCharacter()
  const { status, secAttr } = char

  const form = useReactionForm()
  const { reaction } = form
  const { setReactionForm, reset } = useReactionApi()

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  const reactionAbilities = getReactionAbilities(char, contenders, combat)
  const { parry, dodge } = reactionAbilities

  const { apCost } = reactionsRecord[reaction]
  const leftAp = status.currAp - apCost

  const onSetReaction = (newReaction: keyof typeof reactionsRecord) => {
    setReactionForm({ reaction: newReaction })
  }

  const onPressNext = async () => {
    if (!combat) throw new Error("could not find combat")
    if (leftAp < 0) throw new Error("No enough AP")
    if (reaction === "none") {
      await useCases.combat.updateAction({ combat, payload: { reactionRoll: false } })
      router.replace(routes.combat.action)
      reset()
      return
    }
    scrollNext?.()
  }

  return (
    <DrawerSlide>
      <Col style={{ flex: 1, alignItems: "stretch" }}>
        <Row>
          <Section style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center" }} title="PA">
            <Row>
              <Txt style={[styles.score, apCost > 0 && styles.prevScore]}>{leftAp}</Txt>
              <Txt style={styles.score}> / {secAttr.curr.actionPoints}</Txt>
            </Row>
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
            title="parade"
          >
            {parry.bonus !== 0 ? (
              <Txt style={styles.score}>
                {parry.curr + parry.knowledgeBonus} + {parry.bonus}
              </Txt>
            ) : (
              <Txt style={styles.score}>{parry.total}</Txt>
            )}
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
            title="esquive"
          >
            {dodge.bonus !== 0 ? (
              <Txt style={styles.score}>
                {dodge.curr + dodge.knowledgeBonus} + {dodge.bonus}
              </Txt>
            ) : (
              <Txt style={styles.score}>{dodge.total}</Txt>
            )}
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
              style={{ justifyContent: "space-around", flex: 1 }}
              renderItem={({ item }) => {
                const isSelected = reaction === item.id
                return (
                  <Selectable
                    isSelected={isSelected}
                    onPress={() => onSetReaction(item.id)}
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

        <Section
          title={reaction === "none" ? "valider" : "suivant"}
          contentContainerStyle={styles.centeredSection}
        >
          {reaction === "none" ? (
            <PlayButton size={45} onPress={onPressNext} disabled={leftAp < 0} />
          ) : (
            <NextButton size={45} onPress={onPressNext} disabled={leftAp < 0} />
          )}
        </Section>
      </Col>
    </DrawerSlide>
  )
}
