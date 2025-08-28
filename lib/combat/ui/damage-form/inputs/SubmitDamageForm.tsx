import { reIndexHealthEntries } from "lib/combat/utils/damage-utils"
import Toast from "react-native-toast-message"

import { useCombat } from "providers/CombatProvider"
import { useDamageFormActions, useDamageFormStore } from "providers/DamageFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import PlayButton from "screens/CombatScreen/slides/PlayButton"

export default function SubmitDamageForm() {
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const actions = useDamageFormActions()
  const entries = useDamageFormStore(state => state.entries)
  const submit = async () => {
    if (combat === null) return
    try {
      const payload = reIndexHealthEntries(entries)
      const healthChangeEntries = Object.keys(payload).length === 0 ? false : payload
      await useCases.combat.updateAction({ combat, payload: { healthChangeEntries } })
      Toast.show({ type: "custom", text1: "Dégâts enregistrés !" })
      actions.clear()
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement des dégâts" })
    }
  }
  return <PlayButton onPress={() => submit()} />
}
