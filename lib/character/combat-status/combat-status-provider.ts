import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"

import { CombatStatus, DbCombatStatus } from "./combat-status.types"

export const getCombatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    enabled: charId !== ""
  })

export const csCb = (res: DbCombatStatus) => new CombatStatus(res)

export function useCombatStatus<TData = CombatStatus>(
  id: string,
  select?: (data: CombatStatus) => TData
) {
  return useSuspenseQuery({ ...getCombatStatusOptions(id), select })
}

export function useCombatId(charId: string) {
  return useCombatStatus(charId, cs => cs.combatId)
}

export function useCombatStatuses(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getCombatStatusOptions(id)),
    combine: results => Object.fromEntries(ids.map((id, i) => [id, results[i].data]))
  })
}

export function getCombatStatus(store: QueryClient, charId: string) {
  const cs = store.getQueryData(getCombatStatusOptions(charId).queryKey)
  if (!cs) throw new Error(`Could not find combat status of char : ${charId}`)
  return cs
}

export function getCombatStatuses(store: QueryClient, playableIds: string[]) {
  return Object.fromEntries(
    playableIds.map(id => {
      const data = store.getQueryData(getCombatStatusOptions(id).queryKey)
      if (!data) throw new Error(`Could not find combat status of char : ${id}`)
      return [id, data]
    })
  )
}
