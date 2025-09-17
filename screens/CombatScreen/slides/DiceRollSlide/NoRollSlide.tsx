import { TouchableHighlight } from "react-native"

import { getItemFromId } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionItemDbKey } from "providers/ActionFormProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatState } from "providers/CombatStateProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import SlideError, { slideErrors } from "../SlideError"

export default function NoRollSlide() {
  const useCases = useGetUseCases()
  const inv = useInventory()
  const itemDbKey = useActionItemDbKey()
  const { reset } = useActionApi()
  const combatStatuses = useCombatStatuses()
  const combat = useCombat()
  const contenders = useContenders()
  const { action } = useCombatState()

  const submit = async () => {
    if (!combat) throw new Error("No combat found")
    try {
      const item = getItemFromId(inv, itemDbKey)
      await useCases.combat.doCombatAction({ combat, contenders, combatStatuses, action, item })
      Toast.show({ type: "custom", text1: "Action enregistrée !" })
      reset()
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action. " })
    }
  }

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  return (
    <DrawerSlide>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Txt>
          D&apos;après le MJ, vous n&apos;avez pas besoin de lancer les dés pour cette fois.
        </Txt>
        <Spacer y={30} />
        <Txt>Vous réussissez votre action !</Txt>
        <Spacer y={30} />
        <TouchableHighlight
          style={{
            borderWidth: 2,
            backgroundColor: colors.secColor,
            paddingVertical: 15,
            paddingHorizontal: 20
          }}
          onPress={submit}
        >
          <Txt style={{ color: colors.primColor }}>VALIDER</Txt>
        </TouchableHighlight>
      </Section>
    </DrawerSlide>
  )
}
