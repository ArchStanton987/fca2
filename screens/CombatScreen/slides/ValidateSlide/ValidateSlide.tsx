import { StyleSheet, TouchableOpacity } from "react-native"

import { getItemFromId } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusesProvider"
import { useInventories } from "providers/InventoriesProvider"
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
  const useCases = useGetUseCases()
  const combatStatuses = useCombatStatus()
  const { charId } = useCharacter()
  const { reset } = useActionApi()
  const form = useActionForm()
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const actorId = form.actorId === "" ? charId : form.actorId
  const inv = useInventories(actorId)
  const actor = contenders[actorId]
  const { unarmed } = actor

  const action = combat?.currAction
  if (!action) return <SlideError error={slideErrors.noCombatError} />
  const { rawDamage, itemDbKey } = action
  const isDamageRolled = typeof rawDamage === "number"
  const isWaitingForGm = isDamageRolled && action?.healthChangeEntries === undefined

  const submit = async () => {
    if (!combat) return
    try {
      const itemKey = typeof itemDbKey === "string" ? itemDbKey : undefined
      const item = getItemFromId(inv, itemKey) ?? unarmed
      const payload = { ...action, actorId: charId }
      await useCases.combat.doCombatAction({
        combat,
        combatStatuses,
        contenders,
        action: payload,
        item
      })
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
