import { StyleSheet } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCurrCharId } from "lib/character/character-store"
import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import { useGetReactionAbilities } from "lib/combat/utils/combat-utils"
import { reactionsRecord } from "lib/reaction/reactions.const"

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
import { useAvailableReactions } from "providers/ActionFormProvider"
import { useReactionApi, useReactionForm } from "providers/ReactionProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "./NextButton"
import PlayButton from "./PlayButton"

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

export default function PickReactionSlide({ slideIndex }: SlideProps) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const useCases = useGetUseCases()
  const { data: combatStatus } = useCombatStatus(charId)
  const { data: isGm } = useCharInfo(charId, i => i.isNpc)

  const form = useReactionForm()
  const { reaction } = form
  const { setReactionForm, reset } = useReactionApi()

  const { data: combatId } = useCombatId(charId)
  const { data: actionPoints } = useAbilities(charId, a => a.secAttr.curr.actionPoints)

  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const reactionAbilities = useGetReactionAbilities(charId)

  const { parry, dodge } = reactionAbilities

  const { apCost } = reactionsRecord[reaction]
  const leftAp = combatStatus.currAp - apCost

  const reactions = useAvailableReactions()

  const onSetReaction = (newReaction: keyof typeof reactionsRecord) => {
    setReactionForm({ reaction: newReaction })
  }

  const onPressNext = async () => {
    if (reaction === "none") {
      await useCases.combat.saveReaction({ combatId, payload: { reactionType: reaction } })
      router.replace({
        pathname: isGm
          ? "/squad/[squadId]/character/[charId]/combat/gm-action"
          : "/squad/[squadId]/character/[charId]/combat/action",
        params: { squadId, charId }
      })
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
              <Txt style={styles.score}> / {actionPoints}</Txt>
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
          <HealthFigure charId={charId} />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section
          title={reaction === "none" ? "valider" : "suivant"}
          contentContainerStyle={styles.centeredSection}
        >
          {reaction === "none" ? (
            <PlayButton onPress={onPressNext} disabled={leftAp < 0} />
          ) : (
            <NextButton onPress={onPressNext} disabled={leftAp < 0} />
          )}
        </Section>
      </Col>
    </DrawerSlide>
  )
}
