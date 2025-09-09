import { useCallback } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import { CombatStatus, DbCombatStatus } from "../combat-status.types"

const combatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    enabled: charId !== ""
  })

const cb = (res: DbCombatStatus) => new CombatStatus(res)

export function useCharCombatStatus(charId: string) {
  const q = combatStatusOptions(charId)
  useSub<DbCombatStatus, CombatStatus>({ queryKey: q.queryKey, cb })
  return useQuery(q)
}

export const useContendersCombatStatus = (ids: string[]) => {
  const options = ids.map(id => combatStatusOptions(id))
  useMultiSub<DbCombatStatus, CombatStatus>(options.map(o => ({ queryKey: o.queryKey, cb })))
  return useQueries({
    queries: options,
    combine: useCallback(
      (
        results: Array<ReturnType<typeof useQuery<CombatStatus>>>
      ): {
        isError: boolean
        isPending: boolean
        data: Record<string, CombatStatus>
      } => ({
        isError: results.some(r => r.isError),
        isPending: results.some(r => r.isPending),
        data: Object.fromEntries(ids.map((id, i) => (results[i].data ? [id, results[i].data] : [])))
      }),
      [ids]
    )
  })
}
