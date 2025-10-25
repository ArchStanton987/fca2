import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import GMDamageForm from "lib/combat/ui/damage-form/GMDamageForm"
import { useCombatState } from "lib/combat/use-cases/sub-combat"

import DrawerPage from "components/DrawerPage"
import Txt from "components/Txt"
import { DamageFormProvider } from "providers/DamageFormProvider"

export default function GMDamage() {
  const { charId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const { data: combatId } = useCombatId(charId)
  const { data: action } = useCombatState(combatId, cs => cs.action)

  const { damageLocalization, aimZone, healthChangeEntries } = action
  const isDamageSet = typeof action?.rawDamage === "number"
  const dmgLoc = aimZone || damageLocalization
  const hasHealthEntry = healthChangeEntries !== undefined

  const showForm = isDamageSet && !!dmgLoc && !hasHealthEntry

  return (
    <DrawerPage>
      {showForm ? (
        <DamageFormProvider charId={charId}>
          <GMDamageForm charId={charId} />
        </DamageFormProvider>
      ) : (
        <Txt>Rien à faire pour le moment</Txt>
      )}
    </DrawerPage>
  )
}
