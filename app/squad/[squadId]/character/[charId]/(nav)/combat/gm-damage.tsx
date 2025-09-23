import { Redirect } from "expo-router"

import { useCharInfo } from "lib/character/character-provider"
import GMDamageForm from "lib/combat/ui/damage-form/GMDamageForm"
import { getRealDamage } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCombatState } from "providers/CombatStateProvider"
import { useContenders } from "providers/ContendersProvider"
import { DamageFormProvider } from "providers/DamageFormProvider"

export default function GMDamage() {
  const { charId, isNpc, squadId } = useCharInfo()
  const { action } = useCombatState()
  const contenders = useContenders()

  if (!isNpc)
    return <Redirect href={{ pathname: routes.combat.index, params: { charId, squadId } }} />

  const {
    damageType,
    damageLocalization,
    aimZone,
    healthChangeEntries: existingHealthChangeEntries,
    rawDamage,
    targetId
  } = action
  const isDamageSet = typeof action?.rawDamage === "number"
  const dmgLoc = aimZone || damageLocalization
  const hasHealthEntry = existingHealthChangeEntries !== undefined

  const showForm = isDamageSet && !!dmgLoc && !hasHealthEntry
  let realDamage
  if (rawDamage && targetId && damageType && dmgLoc) {
    const dmgEntry = { rawDamage, damageLocalization: dmgLoc, damageType }
    if (targetId in contenders) {
      realDamage = Math.round(getRealDamage(contenders[targetId], dmgEntry))
    }
  }

  return (
    <DamageFormProvider>
      <DrawerPage>
        {showForm ? (
          <GMDamageForm
            realDamage={realDamage}
            rawDamage={typeof rawDamage === "number" ? rawDamage : undefined}
            damageType={typeof damageType === "string" ? damageType : undefined}
          />
        ) : (
          <Txt>Rien à faire pour le moment</Txt>
        )}
      </DrawerPage>
    </DamageFormProvider>
  )
}
