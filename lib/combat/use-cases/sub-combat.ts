import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

import Combat from "../Combat"
import CombatState from "../CombatState"
import { DbCombatHistory, DbCombatInfo, DbCombatState } from "../combats.types"

const combatStateOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "state"],
    enabled: combatId !== "",
    queryFn: () => new Promise<CombatState>(() => {})
  })
const combatHistoryOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "history"],
    enabled: combatId !== "",
    queryFn: () => new Promise<DbCombatHistory>(() => {})
  })
export const getCombatOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "info"],
    enabled: combatId !== "",
    queryFn: () => new Promise<Combat>(() => {})
  })

const cb = (payload: DbCombatState) => new CombatState(payload)

export function useSubCombatState(combatId: string) {
  const options = combatStateOptions(combatId)
  const path = options.queryKey.join("/")
  useSub(path, cb)
}

export function useCombatState<TData = CombatState>(
  combatId: string,
  select?: (data: CombatState) => TData
) {
  return useSuspenseQuery({ ...combatStateOptions(combatId), select })
}

export function useSubCombatHistory(combatId: string) {
  const options = combatHistoryOptions(combatId)
  const path = options.queryKey.join("/")
  useSub(path)
}

export function useSubCombat(combatId: string) {
  const options = getCombatOptions(combatId)
  const path = options.queryKey.join("/")
  const history = useSuspenseQuery(combatHistoryOptions(combatId))
  useSub(path, (data: DbCombatInfo) => new Combat({ info: data, history, combatId }))
}

export function useCombat<TData = Combat>(combatId: string, select?: (data: Combat) => TData) {
  return useSuspenseQuery({ ...getCombatOptions(combatId), select })
}

export function useContenders(combatId: string) {
  return useCombat(combatId, combat => combat.contendersIds)
}

export function getCombat(store: QueryClient, combatId: string) {
  const combat = store.getQueryData(getCombatOptions(combatId).queryKey)
  if (!combat) throw new Error(`Could not find combat with id : ${combatId}`)
  return combat
}
