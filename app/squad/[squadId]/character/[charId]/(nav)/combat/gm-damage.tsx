import { Redirect } from "expo-router"

import { getActionId, getCurrentRoundId, getRealDamage } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { DamageFormProvider } from "providers/DamageFormProvider"
import GMDamageForm from "screens/AdminTabs/GMDamageForm/GMDamageForm"

export default function GMDamage() {
  const { meta, charId } = useCharacter()
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  if (!meta.isNpc)
    return (
      <Redirect
        href={{ pathname: routes.combat.index, params: { charId, squadId: meta.squadId } }}
      />
    )
  if (combat === null)
    return (
      <DrawerPage>
        <Txt>Impossible de récupérer le combat en cours</Txt>
      </DrawerPage>
    )

  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)
  const action = combat?.rounds?.[roundId]?.[actionId]

  if (!action) {
    return (
      <DrawerPage>
        <Txt>Aucune action en cours</Txt>
      </DrawerPage>
    )
  }

  const {
    damageType,
    damageLocalization,
    healthChangeEntries: existingHealthChangeEntries,
    rawDamage,
    targetId
  } = action
  const isDamageSet = typeof action?.rawDamage === "number"
  const hasDamageLoc = !!damageLocalization
  const hasHealthEntry = existingHealthChangeEntries !== undefined

  const showForm = isDamageSet && hasDamageLoc && !hasHealthEntry

  let realDamage
  if (rawDamage && targetId && damageType && damageLocalization) {
    const dmgEntry = { rawDamage, damageLocalization, damageType }
    if (targetId in contenders) {
      realDamage = getRealDamage(contenders[targetId].char, dmgEntry)
    }
  }

  return (
    <DamageFormProvider>
      <DrawerPage>
        {showForm ? (
          <GMDamageForm realDamage={realDamage} rawDamage={rawDamage} damageType={damageType} />
        ) : (
          <Txt>Rien à faire pour le moment</Txt>
        )}
      </DrawerPage>
    </DamageFormProvider>
  )
}
