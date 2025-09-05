import { StyleSheet } from "react-native"

import { getItemFromId, getItemWithSkillFromId } from "lib/combat/utils/combat-utils"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { isConsumableItem } from "lib/objects/data/consumables/consumables.utils"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
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
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useInventories } from "providers/InventoriesProvider"
import { useScrollTo } from "providers/SlidesProvider"
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
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function ApAssignmentSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const { combat, npcs, players } = useCombat()
  const contenders = { ...players, ...npcs }
  const form = useActionForm()
  const { actionType, actionSubtype, apCost } = form
  const actorId = form.actorId === "" ? character.charId : form.actorId
  const actor = contenders[actorId]
  const inventory = useInventories(actorId)
  const { setForm, reset } = useActionApi()

  const maxAp = actor.char.secAttr.curr.actionPoints
  const { currAp } = actor.char.status

  const { scrollTo } = useScrollTo()

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

  const handleSubmit = async (item?: Consumable | Weapon | Clothing | MiscObject) => {
    if (!combat) return

    const action = { ...combat?.currAction, apCost }
    try {
      await useCases.combat.doCombatAction({ contenders, combat, action, item })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  const onPressNext = async () => {
    if (!combat) return
    await useCases.combat.updateAction({ combat, payload: { apCost } })

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
        const item = getItemFromId(inventory, form.itemDbKey)
        handleSubmit(item)
        break
      }
      case "movement":
        scrollNext()
        return
      case "item": {
        // checks if requires further action (throw, pickup & use when object has challenge label)
        const item = getItemWithSkillFromId(form.itemDbKey, inventory)
        const isConsumable = isConsumableItem(item)
        const hasChallenge = isConsumable && item.data.challengeLabel !== null
        const hasFurtherAction =
          actionSubtype === "throw" ||
          actionSubtype === "pickUp" ||
          (actionSubtype === "use" && hasChallenge)
        if (hasFurtherAction) {
          scrollNext()
          break
        }
        handleSubmit(item)
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
              <NextButton size={45} onPress={onPressNext} />
            </Section>
          </Col>
        </Row>
      </Col>
    </DrawerSlide>
  )
}
