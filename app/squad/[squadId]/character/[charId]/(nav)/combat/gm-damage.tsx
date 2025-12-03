import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import GMDamageForm from "lib/combat/ui/damage-form/GMDamageForm"
import { useCombatState } from "lib/combat/use-cases/sub-combats"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
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
        <Section
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Txt>Rien à faire pour le moment</Txt>
        </Section>
      )}
    </DrawerPage>
  )
}
