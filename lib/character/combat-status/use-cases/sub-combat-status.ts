import { useCallback } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

import { CombatStatus, DbCombatStatus } from "../combat-status.types"

const combatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    staleTime: Infinity
  })

export function useCombatStatus<R>(charId: string, select?: (state: CombatStatus) => R) {
  const q = combatStatusOptions(charId)
  const cb = useCallback((payload: DbCombatStatus) => new CombatStatus(payload), [])
  useSub<CombatStatus, DbCombatStatus>({ queryKey: q.queryKey, cb })
  return useQuery({ ...q, select })
}

export const useContendersCombatStatus = (ids: string[]) =>
  useQueries({
    queries: ids.map(id => combatStatusOptions(id))
  })
