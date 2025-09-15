/* eslint-disable import/prefer-default-export */
import { useCallback } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import CombatState from "../CombatState"
import { DbCombatHistory, DbCombatInfo, DbCombatState } from "../combats.types"

const combatStateOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combat", combatId, "state"],
    enabled: combatId !== "",
    queryFn: () => new Promise<CombatState>(() => {})
  })
const combatHistoryOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combat", combatId, "history"],
    enabled: combatId !== "",
    queryFn: () => new Promise<DbCombatHistory>(() => {})
  })
export const combatInfoOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combat", combatId, "info"],
    enabled: combatId !== "",
    queryFn: () => new Promise<DbCombatInfo>(() => {})
  })

const cb = (payload: DbCombatState) => new CombatState(payload)

export function useSubCombatState(combatId: string) {
  const options = combatStateOptions(combatId)
  const path = options.queryKey.join("/")
  useSub<DbCombatState, CombatState>(path, cb)
  return useQuery(options)
}

export function useSubCombatHistory(combatId: string) {
  const options = combatHistoryOptions(combatId)
  const path = options.queryKey.join("/")
  useSub<DbCombatHistory>(path)
  return useQuery(options)
}

export function useSubCombatInfo(combatId: string) {
  const options = combatInfoOptions(combatId)
  const path = options.queryKey.join("/")
  useSub<DbCombatInfo>(path)
  return useQuery(options)
}

export function useSubGameCombatsInfo(ids: string[]) {
  const options = ids.map(id => combatInfoOptions(id))
  const subs = options.map(o => ({ path: o.queryKey.join("/") }))
  useMultiSub<DbCombatInfo>(subs)
  return useQueries({
    queries: options,
    combine: useCallback(
      (
        results: Array<ReturnType<typeof useQuery<DbCombatInfo>>>
      ): { isError: boolean; isPending: boolean; data: Record<string, DbCombatInfo> } => ({
        isPending: results.some(r => r.isPending),
        isError: results.some(r => r.isError),
        data: Object.fromEntries(ids.map((id, i) => (results[i].data ? [id, results[i].data] : [])))
      }),
      [ids]
    )
  })
}
