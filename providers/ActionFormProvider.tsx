import { ReactNode, createContext, useContext, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import Action from "lib/combat/Action"
import { ActionStore, createActionStore } from "lib/combat/action-store"
import { combatStateOptions } from "lib/combat/use-cases/sub-combats"
import { getActorSkillFromAction, getSkillFromAction } from "lib/combat/utils/combat-utils"
import { useCombatWeapons, useItem } from "lib/inventory/use-sub-inv-cat"
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
export const useActionDamageLocScore = () => useActionForm(state => state.damageLocalizationScore)
export const useActionRawDamage = () => useActionForm(state => state.rawDamage)
export const useActionDamageType = () => useActionForm(state => state.damageType)
export const useActionItemDbKey = () => useActionForm(state => state.itemDbKey)

export const useActionApi = () => useActionForm(state => state.actions)

export const useActionItem = (actorId: string, dbKey: string = "") => {
  const combatWeapons = useCombatWeapons(actorId)
  const { data: item } = useItem(actorId, dbKey)
  if (item) return item
  const equWeaponIndex = combatWeapons.findIndex(w => w.dbKey === dbKey)
  return equWeaponIndex === -1 ? undefined : combatWeapons[equWeaponIndex]
}

export const useDamageRoll = (charId: string) => {
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()
  const item = useActionItem(charId, itemDbKey)

  switch (actionSubtype) {
    case "basic":
    case "aim":
      if (item?.category !== "weapons") return 0
      return item?.data?.damageBasic
    case "burst":
      if (item?.category !== "weapons") return 0
      return item.data.damageBurst
    case "hit":
    case "throw": {
      const weight = item?.data?.weight ?? 0.5
      const roundedWeight = Math.round(weight)
      return `1D6+DM+${roundedWeight}`
    }
    default:
      return "-"
  }
}

export const useActionSkill = (actorId: string) => {
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()
  const item = useActionItem(actorId, itemDbKey)
  return getSkillFromAction({ actionType, actionSubtype, item })
}

export const useActionSkillScore = (actorId: string) => {
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()
  const item = useActionItem(actorId, itemDbKey)
  const { data: abilities } = useAbilities(actorId)
  const { data: charInfo } = useCharInfo(actorId, i => ({
    templateId: i.templateId,
    isCritter: i.isCritter
  }))
  return getActorSkillFromAction({ actionType, actionSubtype, item }, abilities, charInfo)
    .sumAbilities
}
