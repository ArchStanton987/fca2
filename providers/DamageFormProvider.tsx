import { ReactNode, createContext, useContext, useState } from "react"

import Playable from "lib/character/Playable"
import Action from "lib/combat/Action"
import { DamageEntry } from "lib/combat/combats.types"
import { GMDamageFormState, createDmgStore } from "lib/combat/gm-damage-store"
import { getRealDamage } from "lib/combat/utils/combat-utils"
import { StoreApi, useStore } from "zustand"

import { useCombatState } from "./CombatStateProvider"
import { useContenders } from "./ContendersProvider"

const GmDamageContext = createContext<StoreApi<GMDamageFormState>>(
  {} as StoreApi<GMDamageFormState>
)

const getInitDamageEntry = (action: Action | undefined, contenders: Record<string, Playable>) => {
  let initEntry: DamageEntry = {
    charId: "",
    entryType: "hp",
    localization: "rightTorsoHp",
    damage: 1
  }
  if (action) {
    const { rawDamage, damageLocalization, targetId, damageType, aimZone } = action
    const loc = aimZone || damageLocalization
    if (targetId && targetId in contenders && loc && rawDamage && damageType) {
      const newDmgEntry = { rawDamage, damageLocalization: loc, damageType }
      const realDamage = Math.round(getRealDamage(contenders[targetId], newDmgEntry))
      initEntry = {
        charId: targetId,
        entryType: "hp",
        localization: loc,
        damage: realDamage
      }
    }
  }
  return initEntry
}
// const getInitRadsEntry = (
//   action: Action | undefined,
//   contenders: Record<string, { char: Playable }>
// ) => {
//   let initEntry: DamageEntry = {
//     charId: "",
//     entryType: "rads",
//     amount: 10
//   }
//   if (action) {
//     const { actorId = "", targetId, itemDbKey } = action
//     const actor = contenders[actorId]?.char
//     if (!actor) return initEntry
//     let item = null
//     if (actor instanceof Character) {
//       const wpn = actor.equipedObjects.weapons.find(w => w.dbKey === itemDbKey)
//       if (!wpn) return initEntry
//       const amount = wpn.
//     }
//   }
// }

export function DamageFormProvider({ children }: { children: ReactNode }) {
  const contenders = useContenders()
  const { action } = useCombatState()

  const [store] = useState(() => {
    const initEntry = getInitDamageEntry(action, contenders)
    return createDmgStore({ 0: initEntry })
  })

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
