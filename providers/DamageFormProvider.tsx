import { ReactNode, createContext, useContext, useState } from "react"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { DamageEntry } from "lib/combat/combats.types"
import { GMDamageFormState, createDmgStore } from "lib/combat/gm-damage-store"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { getRealDamage, useDamageLocalization } from "lib/combat/utils/combat-utils"
import { useItems } from "lib/inventory/use-sub-inv-cat"
import { StoreApi, useStore } from "zustand"

const GmDamageContext = createContext<StoreApi<GMDamageFormState>>(
  {} as StoreApi<GMDamageFormState>
)

export const useGetInitDamageEntry = (combatId: string): DamageEntry => {
  const { data: action } = useCombatState(combatId, cs => cs.action)
  const targetId = action.targetId || ""
  const { data: items } = useItems(targetId)

  const damageLocalization = useDamageLocalization(
    action.damageLocalizationScore || 0,
    action.targetId ? action.targetId : ""
  )

  const dmgEntry = {
    damageLocalization: action.aimZone || damageLocalization,
    rawDamage: action.rawDamage || 0,
    damageType: action.damageType || "physical"
  }
  return {
    charId: targetId,
    entryType: "hp",
    localization: damageLocalization,
    damage: getRealDamage(items, dmgEntry)
  }
}

export function DamageFormProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const { data: combatId } = useCombatId(charId)
  const initEntry = useGetInitDamageEntry(combatId)
  const [store] = useState(() => createDmgStore({ 0: initEntry }))
  return <GmDamageContext.Provider value={store}>{children}</GmDamageContext.Provider>
}

export function useDamageFormStore<T>(selector: (state: GMDamageFormState) => T): T {
  const store = useContext(GmDamageContext)
  if (!store) {
    throw new Error("useDamageFormStore must be used within its provider")
  }
  return useStore(store, selector)
}

export const useDamageEntry = (id: number) => useDamageFormStore(state => state.entries[id])
export const useDamageFormActions = () => useDamageFormStore(state => state.actions)
