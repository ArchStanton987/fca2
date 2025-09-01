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

export function useCombatStatus(charId: string) {
  const q = combatStatusOptions(charId)
  const cb = useCallback((payload: DbCombatStatus) => new CombatStatus(payload), [])
  useSub<CombatStatus, DbCombatStatus>({ queryKey: q.queryKey, cb })
  return useQuery(q)
}

export const useCurrentActionPoints = (charId: string) =>
  useQuery({
    ...combatStatusOptions(charId),
    select: data => data.currAp
  })
export const useCurrentCombatId = (charId: string) =>
  useQuery({
    ...combatStatusOptions(charId),
    select: data => data.combatId
  })

export const useContendersCombatStatus = (ids: string[]) =>
  useQueries({
    queries: ids.map(id => combatStatusOptions(id))
  })
