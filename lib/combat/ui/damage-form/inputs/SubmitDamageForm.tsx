import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombat } from "lib/combat/use-cases/sub-combats"
import { reIndexHealthEntries } from "lib/combat/utils/damage-utils"
import Toast from "react-native-toast-message"

import { useDamageFormActions, useDamageFormStore } from "providers/DamageFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import PlayButton from "screens/CombatScreen/slides/PlayButton"

export default function SubmitDamageForm() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const useCases = useGetUseCases()
  const { data: combatId } = useCombatId(charId)
  const combat = useCombat(combatId)
  const actions = useDamageFormActions()
  const entries = useDamageFormStore(state => state.entries)
  const submit = async () => {
    if (combat === null) return
    try {
      const payload = reIndexHealthEntries(entries)
      const healthChangeEntries = Object.keys(payload).length === 0 ? false : payload
      await useCases.combat.updateAction({ combatId, payload: { healthChangeEntries } })
      Toast.show({ type: "custom", text1: "Dégâts enregistrés !" })
      actions.clear()
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement des dégâts" })
    }
  }
  return <PlayButton onPress={() => submit()} />
}
