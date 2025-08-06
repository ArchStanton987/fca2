import { StyleSheet } from "react-native"

import { router } from "expo-router"

import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { DODGE_AP_COST, PARRY_AP_COST } from "lib/combat/const/combat-const"
import { getCurrentRoundId, getParrySkill } from "lib/combat/utils/combat-utils"
import { reactions } from "lib/reaction/reactions.const"

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
  const roundId = getCurrentRoundId(combat)
  const char = useCharacter()
  const { charId, skills, equipedObjects, knowledgesRecord, status, secAttr } = char

  const form = useReactionForm()
  const { reaction } = form
  const { setReactionForm, reset } = useReactionApi()

  const armorClassBonus = contenders?.[charId]?.combatData?.acBonusRecord?.[roundId] ?? 0
  const actionArmorClass = secAttr.curr.armorClass + armorClassBonus

  const actionBonus = contenders?.[charId]?.combatData?.actionBonus ?? 0

  const dodgeKBonus = knowledgeLevels.find(el => el.id === knowledgesRecord.kDodge)?.bonus ?? 0
  const dodgeScore = skills.curr.physical + dodgeKBonus

  const weaponSkill = equipedObjects.weapons[0].data.skillId
  const parryKBonus = knowledgeLevels.find(el => el.id === knowledgesRecord.kParry)?.bonus ?? 0
  const parrySkill = getParrySkill(weaponSkill)
  const parryScore = skills.curr[parrySkill] + parryKBonus

  const { apCost } = reactionsMap[reaction]
  const leftAp = status.currAp - apCost

  const onSetReaction = (newReaction: keyof typeof reactionsMap) => {
    let skillScore = 0
    let skillId
    if (newReaction === "parry" || newReaction === "dodge") {
      skillScore = newReaction === "parry" ? parryScore : dodgeScore
      skillId = newReaction === "parry" ? parrySkill : "physical"
    }
    setReactionForm({
      reaction: newReaction,
      apCost: reactionsMap[newReaction].apCost,
      armorClass: actionArmorClass,
      skillScore,
      skillId
    })
  }

  const onPressNext = async () => {
    if (!scrollNext) throw new Error("scroll fn not provided")
    if (!combat) throw new Error("could not find combat")
    if (leftAp < 0) throw new Error("No enough AP")
    if (reaction === "none") {
      await useCases.combat.updateAction({ combat, payload: { oppositionRoll: false } })
      router.replace(routes.combat.action)
      reset()
      return
    }
    scrollNext()
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
            {actionBonus !== 0 ? (
              <Txt style={styles.score}>
                {parryScore} + {actionBonus}
              </Txt>
            ) : (
              <Txt style={styles.score}>{parryScore}</Txt>
            )}
          </Section>
          <Spacer x={layout.globalPadding} />
          <Section
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: "center" }}
            title="esquive"
          >
            {actionBonus !== 0 ? (
              <Txt style={styles.score}>
                {dodgeScore} + {actionBonus}
              </Txt>
            ) : (
              <Txt style={styles.score}>{dodgeScore}</Txt>
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
