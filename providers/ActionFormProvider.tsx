import { ReactNode, createContext, useContext, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import Action from "lib/combat/Action"
import { ActionStore, createActionStore } from "lib/combat/action-store"
import { combatStateOptions } from "lib/combat/use-cases/sub-combats"
import { getSkillFromAction } from "lib/combat/utils/combat-utils"
import { useItem } from "lib/inventory/use-sub-inv-cat"
import { StoreApi, useStore } from "zustand"

const ActionContext = createContext<StoreApi<ActionStore>>({} as StoreApi<ActionStore>)

export function ActionFormProvider({
  children,
  combatId
}: {
  children: ReactNode
  combatId: string
}) {
  const { data: action } = useQuery({
    ...combatStateOptions(combatId),
    select: state => state.action
  })
  const [actionStore] = useState(() => createActionStore(action ?? new Action({})))
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
export const useActionDamageType = () => useActionForm(state => state.damageType)
export const useActionItemDbKey = () => useActionForm(state => state.itemDbKey)

export const useActionApi = () => useActionForm(state => state.actions)

export const useDamageRoll = (charId: string) => {
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()
  const { data: item } = useItem(charId, itemDbKey ?? "")

  switch (actionSubtype) {
    case "basic":
    case "aim":
      if (item.category !== "weapons") throw new Error("Item is not a weapon.")
      return item.data.damageBasic
    case "burst":
      if (item.category !== "weapons") throw new Error("Item is not a weapon.")
      return item.data.damageBurst
    case "hit":
    case "throw": {
      const weight = item?.data?.weight ?? 0.5
      const roundedWeight = Math.round(weight)
      return `1D6+DM+${roundedWeight}`
    }
    default:
      throw new Error("unknown action subtype for weapon")
  }
}

export const useActionSkill = (actorId: string) => {
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey() ?? ""
  const { data: item } = useItem(actorId, itemDbKey)
  return getSkillFromAction({ actionType, actionSubtype, item })
}
