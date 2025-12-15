import { ReactNode } from "react"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import GMDamageForm from "lib/combat/ui/damage-form/GMDamageForm"
import { useCombat, useCombatState } from "lib/combat/use-cases/sub-combats"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Txt from "components/Txt"
import { DamageFormProvider } from "providers/DamageFormProvider"

function DamageWrapper({ children, combatId }: { children: ReactNode; combatId: string }) {
  const { data: isReady } = useCombatState(combatId, cs => {
    if (!(typeof cs.action.rawDamage === "number")) return false
    if (!cs.action.targetId) return false
    const hasHealthEntry = cs.action.healthChangeEntries !== undefined
    return !hasHealthEntry
  })
  if (!isReady)
    return (
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Txt>Rien à faire pour le moment</Txt>
      </Section>
    )
  return children
}

export default function GMDamage() {
  const charId = useCurrCharId()

  const { data: combatId } = useCombatId(charId)
  const { data: actionKey } = useCombat(combatId, c => `${c.currRoundId}-${c.currActionId}`)
  return (
    <DrawerPage>
      <DamageWrapper combatId={combatId} key={actionKey}>
        <DamageFormProvider charId={charId}>
          <GMDamageForm charId={charId} />
        </DamageFormProvider>
      </DamageWrapper>
    </DrawerPage>
  )
}
