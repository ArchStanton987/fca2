import { memo } from "react"
import { StyleSheet } from "react-native"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCurrCharId } from "lib/character/character-store"
import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import Toast from "react-native-toast-message"

import CheckBox from "components/CheckBox/CheckBox"
import Col from "components/Col"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import {
  useActionActorId,
  useActionApCost,
  useActionApi,
  useActionItem,
  useActionItemDbKey,
  useActionSubtype,
  useActionType
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "./NextButton"

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  centeredSection: {
    justifyContent: "center",
    alignItems: "center"
  }
})

function ApAssignmentSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()
  const useCases = useGetUseCases()
  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId

  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId, s => s.action)

  const apCost = useActionApCost()
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()

  const item = useActionItem(actorId, itemDbKey)
  const { data: currAp } = useCombatStatus(actorId, s => s.currAp)
  const { data: maxAp } = useAbilities(actorId, a => a.secAttr.curr.actionPoints)

  const { setForm, reset } = useActionApi()

  const { scrollTo, resetSlider } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

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

  const handleSubmit = async () => {
    const payload = { ...action, apCost }
    try {
      await useCases.combat.doCombatAction({ combatId, action: payload, item })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
      resetSlider()
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  const onPressNext = async () => {
    await useCases.combat.updateAction({ combatId, payload: { apCost } })

    switch (actionType) {
      case "other": {
        handleSubmit()
        break
      }
      case "weapon": {
        if (actionSubtype !== "reload" && actionSubtype !== "unload") {
          scrollNext()
          break
        }
        handleSubmit()
        break
      }
      case "movement":
        scrollNext()
        return
      case "item": {
        // checks if requires further action (throw, pickup & use when object has challenge label)
        const isConsumable = item?.category === "consumables"
        const hasChallenge = isConsumable && item.data.challengeLabel !== null
        const hasFurtherAction =
          actionSubtype === "throw" ||
          actionSubtype === "pickUp" ||
          (actionSubtype === "use" && hasChallenge)
        if (hasFurtherAction) {
          scrollNext()
          break
        }
        handleSubmit()
        break
      }
      default:
        throw new Error("Action not supported")
    }
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    const isChecked = i < currAp
    const isPreview = i >= currAp - apCost && i < currAp
    apArr.push({ id: i.toString(), isChecked, isPreview })
  }

  return (
    <DrawerSlide>
      <Col style={{ flex: 1 }}>
        <Section title="Points d'action">
          <List
            data={apArr}
            horizontal
            style={styles.checkboxContainer}
            keyExtractor={e => e.id}
            renderItem={props => (
              <CheckBox
                color={props.item.isPreview ? colors.yellow : colors.secColor}
                size={30}
                isChecked={props.item.isChecked}
                onPress={() => setApCost(parseInt(props.item.id, 10))}
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
            contentContainerStyle={[styles.centeredSection, { flex: 1 }]}
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
              <NextButton onPress={onPressNext} />
            </Section>
          </Col>
        </Row>
      </Col>
    </DrawerSlide>
  )
}

export default memo(ApAssignmentSlide)
