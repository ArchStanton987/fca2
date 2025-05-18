import { StyleSheet } from "react-native"

import { getActionId, getCurrentRoundId } from "lib/combat/utils/combat-utils"

import CheckBox from "components/CheckBox/CheckBox"
import Col from "components/Col"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "./NextButton"
import SlideError, { slideErrors } from "./SlideError"

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

type DiceResultSlideProps = {
  scrollNext?: () => void
}

export default function ApAssignmentSlide({ scrollNext }: DiceResultSlideProps) {
  const useCases = useGetUseCases()
  const { status, secAttr } = useCharacter()
  const { combat, npcs, players } = useCombat()
  const contenders = { ...players, ...npcs }
  const form = useActionForm()
  const { apCost } = form
  const { setForm, reset } = useActionApi()

  const maxAp = secAttr.curr.actionPoints
  const { currAp } = status

  const incApCost = (type: "add" | "remove") => {
    let newApCost
    if (type === "add") {
      newApCost = apCost + 1 > currAp ? currAp : apCost + 1
    } else {
      newApCost = apCost - 1 < 0 ? 0 : apCost - 1
    }
    setForm({ apCost: newApCost })
  }
  const setApCost = (index: number) => {
    let newApCost = currAp - index
    if (newApCost <= apCost) {
      newApCost -= 1
    }
    setForm({ apCost: newApCost })
  }

  const onPressNext = async () => {
    if (!combat || !scrollNext) return
    await useCases.combat.updateAction({ combat, payload: { apCost } })
    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)
    const roll = combat.rounds?.[roundId]?.[actionId]?.roll

    // if player must roll dices, go to next slide
    if (roll !== false) {
      scrollNext()
      return
    }

    // if action doesn't require additional step, save it
    const shouldSaveAction =
      form.actionType === "movement" ||
      (form.actionType === "item" && form.actionSubtype !== "pickUp") ||
      (form.actionType === "item" && form.actionSubtype !== "throw")

    if (!shouldSaveAction) throw new Error("Action not supported")

    await useCases.combat.doCombatAction({ contenders, combat, action: { ...form, roll } })
    reset()
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    const isChecked = i < currAp
    const isPreview = i >= currAp - apCost && i < currAp
    apArr.push({ id: i.toString(), isChecked, isPreview })
  }

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  return (
    <DrawerSlide>
      <Col style={{ flex: 1 }}>
        <Section title="Points d'action">
          <List
            data={apArr}
            horizontal
            style={styles.checkboxContainer}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CheckBox
                color={item.isPreview ? colors.yellow : colors.secColor}
                size={30}
                isChecked={item.isChecked}
                onPress={() => setApCost(parseInt(item.id, 10))}
              />
            )}
          />
          <Spacer y={layout.globalPadding} />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Row style={{ flex: 1 }}>
          <Section
            title="modifier coût d'action"
            style={{ flex: 1 }}
            contentContainerStyle={styles.centeredSection}
          >
            <Row style={{ alignItems: "center" }}>
              <MinusIcon onPress={() => incApCost("remove")} />
              <Spacer x={40} />
              <Txt style={{ fontSize: 55 }}>{apCost}</Txt>
              <Spacer x={40} />
              <PlusIcon onPress={() => incApCost("add")} />
            </Row>
          </Section>

          <Spacer x={layout.globalPadding} />

          <Col style={{ width: 120 }}>
            <Section style={{ flex: 1 }} title="PA" contentContainerStyle={styles.centeredSection}>
              <Row>
                <Txt
                  style={{
                    fontSize: 30,
                    color: apCost === 0 ? colors.secColor : colors.yellow
                  }}
                >
                  {currAp - apCost}{" "}
                </Txt>
                <Txt style={{ fontSize: 30 }}>/ {maxAp}</Txt>
              </Row>
            </Section>
            <Spacer y={layout.globalPadding} />

            <Section title="valider" contentContainerStyle={styles.centeredSection}>
              <NextButton size={45} onPress={onPressNext} />
            </Section>
          </Col>
        </Row>
      </Col>
    </DrawerSlide>
  )
}
