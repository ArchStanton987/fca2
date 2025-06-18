import { StyleSheet, TouchableOpacity } from "react-native"

import { getActionId, getCurrentRoundId, getItemFromId } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import AwaitGmSlide from "../AwaitGmSlide"

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
  const useCases = useGetUseCases()
  const inv = useInventory()
  const form = useActionForm()
  const { reset } = useActionApi()
  const { rawDamage, itemDbKey } = form
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const isDamageRolled = typeof rawDamage === "number"

  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)
  const action = combat?.rounds?.[roundId]?.[actionId]
  const isWaitingForGm = isDamageRolled && action?.healthChangeEntries === undefined

  const submit = async () => {
    if (!combat) return
    try {
      const item = getItemFromId(inv, itemDbKey)
      await useCases.combat.doCombatAction({ combat, contenders, action: form, item })
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
