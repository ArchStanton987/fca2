import { StyleSheet } from "react-native"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { useItem } from "lib/inventory/use-sub-inv-cat"
import Consumable from "lib/objects/data/consumables/Consumable"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useActionActorId, useActionApi, useActionItemDbKey } from "providers/ActionFormProvider"
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
  const itemDbKey = useActionItemDbKey()
  const actorId = useActionActorId()

  const { reset } = useActionApi()
  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId)
  const { data: consumable } = useItem(actorId, itemDbKey ?? "")

  const submit = async (item: Consumable) => {
    try {
      const payload = { ...action, actorId }
      await useCases.combat.doCombatAction({ action: payload, combatId, item })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
    } catch (err) {
      Toast.show({ type: "custom", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  if (consumable.category !== "consumables")
    return <SlideError error={slideErrors.noConsumableError} />

  return (
    <DrawerSlide>
      <ScrollSection style={{ flex: 1 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Txt style={styles.title}>
            {consumable.data.label} : {consumable.data.challengeLabel}
          </Txt>
          <Row style={{ alignItems: "baseline" }}>
            <Txt>Restant : </Txt>
            <Txt style={styles.title}>
              {consumable.remainingUse} / {consumable.data.maxUsage}
            </Txt>
          </Row>
        </Row>
        <Spacer y={15} />
        <Txt>Description :</Txt>
        <Spacer y={5} />
        <Txt>{consumable.data.description}</Txt>
        <Spacer y={30} />
        <Txt>
          Une fois l&apos;action résolue en accord avec le MJ, vous pouvez valider votre action (en
          bas à droite)
        </Txt>
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 180 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <HealthFigure charId={actorId} />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section
          title="valider"
          contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
        >
          <PlayButton onPress={() => submit(consumable)} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
