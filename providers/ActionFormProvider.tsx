import { ReactNode, createContext, useContext, useState } from "react"

import { useLocalSearchParams } from "expo-router"

import { ActionStore, createActionStore } from "lib/combat/action-store"
import { useCombatState } from "lib/combat/use-cases/sub-combat"
import { StoreApi, useStore } from "zustand"

const ActionContext = createContext<StoreApi<ActionStore>>({} as StoreApi<ActionStore>)

export function ActionFormProvider({ children }: { children: ReactNode }) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { data: action } = useCombatState(charId, state => state.action)

  const [actionStore] = useState(() => createActionStore(action))

  return <ActionContext.Provider value={actionStore}>{children}</ActionContext.Provider>
}

export function useActionForm<T>(selector: (state: ActionStore) => T): T {
  const store = useContext(ActionContext)
  if (!store) {
    throw new Error("useActionForm must be used within its provider")
  }
  return useStore(store, selector)
}

export const useActionActorId = () => useActionForm(state => state.actorId)
export const useActionType = () => useActionForm(state => state.actionType)
export const useActionSubtype = () => useActionForm(state => state.actionSubtype)
export const useIsCombinedAction = () => useActionForm(state => state.isCombinedAction)
export const useActionApCost = () => useActionForm(state => state.apCost)
export const useActorDiceScore = () => useActionForm(state => state.actorDiceScore)
export const useActionTargetId = () => useActionForm(state => state.targetId)
export const useActionAimZone = () => useActionForm(state => state.aimZone)
export const useActionDamageLoc = () => useActionForm(state => state.damageLocalization)
export const useActionRawDamage = () => useActionForm(state => state.rawDamage)
export const useActionDamageType = () => useActionForm(state => state.rawDamage)
export const useActionItemDbKey = () => useActionForm(state => state.itemDbKey)

export const useActionApi = () => useActionForm(state => state.actions)
