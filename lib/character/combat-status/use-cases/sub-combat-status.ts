import { useCallback } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import { CombatStatus, DbCombatStatus } from "../combat-status.types"

const combatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    enabled: charId !== "",
    staleTime: Infinity
  })

// export function useSubCombatStatus<R>(charId: string, select?: (state: CombatStatus) => R) {
//   const o = combatStatusOptions(charId)
//   const cb = useCallback((payload: DbCombatStatus) => new CombatStatus(payload), [])
//   useSub<CombatStatus, DbCombatStatus>({ queryKey: o.queryKey, cb })
//   return useQuery({ ...o, select })
// }

export function useSubCombatStatus(charId: string) {
  const q = combatStatusOptions(charId)
  const cb = useCallback((payload: DbCombatStatus) => new CombatStatus(payload), [])
  useSub<CombatStatus, DbCombatStatus>({ queryKey: q.queryKey, cb })
  return useQuery(q)
}

export const useContendersCombatStatus = (ids: string[]) => {
  const options = ids.map(id => combatStatusOptions(id))
  useMultiSub(options.map(o => ({ queryKey: o.queryKey })))
  useQueries({
    queries: options,
    combine: useCallback(
      (results: Array<ReturnType<typeof useQuery<CombatStatus>>>) => ({
        isPending: results.some(r => r.isPending),
        data: Object.fromEntries(ids.map((id, i) => [id, results[i].data]))
      }),
      [ids]
    )
  })
}
