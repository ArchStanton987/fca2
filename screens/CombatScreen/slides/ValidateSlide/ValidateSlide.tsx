import { ReactNode } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import Toast from "react-native-toast-message"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionActorId, useActionApi, useActionItem } from "providers/ActionFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import AwaitGmSlide from "../wait-slides/AwaitGmSlide"

const styles = StyleSheet.create({
  cta: {
    padding: 20,
    backgroundColor: colors.secColor
  },
  ctaText: {
    color: colors.primColor
  },
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

function AwaitDamageWrapper({ children, actorId }: { children: ReactNode; actorId: string }) {
  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId, cs => ({
    rawDamage: cs.action.rawDamage,
    healthChangeEntries: cs.action.healthChangeEntries
  }))
  const { rawDamage, healthChangeEntries } = action
  const isDamageRolled = typeof rawDamage === "number"
  const isWaitingForGm = isDamageRolled && healthChangeEntries === undefined
  if (isWaitingForGm) return <AwaitGmSlide messageCase="damage" />
  return children
}

export default function ValidateSlide() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const useCases = useGetUseCases()
  const { reset } = useActionApi()
  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId, cs => cs.action)
  const item = useActionItem(actorId, action.itemDbKey ? action.itemDbKey : undefined)

  const submit = async () => {
    try {
      await useCases.combat.doCombatAction({ combatId, action, item })
      Toast.show({ type: "custom", text1: "Action réalisée !" })
      reset()
    } catch (err) {
      Toast.show({ type: "error", text1: "Echec lors de l'enregistrement de l'action" })
    }
  }

  return (
    <AwaitDamageWrapper actorId={actorId}>
      <DrawerSlide>
        <Section style={{ flex: 1 }} title="valider" contentContainerStyle={styles.centeredSection}>
          <Txt>Une fois que le MJ a fini son laïus, on peut valider l&apos;action !</Txt>
          <Spacer y={30} />
          <TouchableOpacity style={styles.cta} onPress={() => submit()}>
            <Txt style={styles.ctaText}>VALIDER</Txt>
          </TouchableOpacity>
        </Section>
      </DrawerSlide>
    </AwaitDamageWrapper>
  )
}
