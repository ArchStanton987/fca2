import { StyleSheet } from "react-native"

import { Consumable } from "lib/objects/data/consumables/consumables.types"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import PlayButton from "./PlayButton"
import SlideError, { slideErrors } from "./SlideError"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {},
  emph: {},
  score: {}
})

export default function ChallengeSlide() {
  const useCases = useGetUseCases()
  const { charId } = useCharacter()
  const form = useActionForm()
  const { itemDbKey } = form
  const { reset } = useActionApi()
  const inv = useInventory()
  const { players, npcs, combat } = useCombat()
  const contenders = { ...players, ...npcs }

  const submit = async (item: Consumable) => {
    if (!combat) throw new Error("no combat")
    try {
      const action = { ...form, actorId: charId }
      await useCases.combat.doCombatAction({ action, contenders, combat, item })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
    } catch (err) {
      Toast.show({ type: "custom", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  if (!itemDbKey) return <SlideError error={slideErrors.noItemError} />
  const isConsumable = itemDbKey in inv.consumablesRecord
  if (!isConsumable) return <SlideError error={slideErrors.noConsumableError} />
  const item = inv.consumablesRecord[itemDbKey]

  return (
    <DrawerSlide>
      <ScrollSection style={{ flex: 1 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Txt style={styles.title}>
            {item.data.label} : {item.data.challengeLabel}
          </Txt>
          <Row style={{ alignItems: "baseline" }}>
            <Txt>Restant : </Txt>
            <Txt style={styles.title}>
              {item.remainingUse} / {item.data.maxUsage}
            </Txt>
          </Row>
        </Row>
        <Spacer y={15} />
        <Txt>Description :</Txt>
        <Spacer y={5} />
        <Txt>{item.data.description}</Txt>
        <Spacer y={30} />
        <Txt>
          Une fois l&apos;action résolue en accord avec le MJ, vous pouvez valider votre action (en
          bas à droite)
        </Txt>
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 180 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <HealthFigure />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section
          title="valider"
          contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
        >
          <PlayButton onPress={() => submit(item)} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
