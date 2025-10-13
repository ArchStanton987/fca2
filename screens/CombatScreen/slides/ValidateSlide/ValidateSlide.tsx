import { StyleSheet, TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combat"
import { useItem } from "lib/inventory/use-sub-inv-cat"
import Weapon from "lib/objects/data/weapons/Weapon"
import Toast from "react-native-toast-message"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import SlideError, { slideErrors } from "../SlideError"
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

export default function ValidateSlide() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const useCases = useGetUseCases()
  const { reset } = useActionApi()
  const formActorId = useActionActorId()
  const { data: combatId } = useCombatId(charId)
  const { data: action } = useCombatState(charId, cs => cs.action)
  const actorId = formActorId === "" ? charId : formActorId
  const { data: item = Weapon.getUnarmed() } = useItem(actorId, action?.itemDbKey || "")

  if (!action) return <SlideError error={slideErrors.noCombatError} />
  const { rawDamage, itemDbKey } = action
  const isDamageRolled = typeof rawDamage === "number"
  const isWaitingForGm = isDamageRolled && action?.healthChangeEntries === undefined

  const submit = async () => {
    try {
      await useCases.combat.doCombatAction({ combatId, action, item })
      Toast.show({ type: "custom", text1: "Action réalisée !" })
      reset()
    } catch (err) {
      Toast.show({ type: "error", text1: "Echec lors de l'enregistrement de l'action" })
    }
  }

  if (isWaitingForGm) return <AwaitGmSlide messageCase="damage" />

  return (
    <DrawerSlide>
      <Section style={{ flex: 1 }} title="valider" contentContainerStyle={styles.centeredSection}>
        <Txt>Une fois que le MJ a fini son laïus, on peut valider l&apos;action !</Txt>
        <Spacer y={30} />
        <TouchableOpacity style={styles.cta} onPress={() => submit()}>
          <Txt style={styles.ctaText}>VALIDER</Txt>
        </TouchableOpacity>
      </Section>
    </DrawerSlide>
  )
}
