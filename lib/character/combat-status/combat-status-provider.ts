import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

import { CombatStatus, DbCombatStatus } from "./combat-status.types"

export const combatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    enabled: charId !== ""
  })

const cb = (res: DbCombatStatus) => new CombatStatus(res)

export function useSubPlayablesCombatStatus(ids: string[]) {
  const options = ids.map(id => combatStatusOptions(id))
  const subs = options.map(o => ({ path: o.queryKey.join("/"), cb }))
  useMultiSub(subs)
}

export function useCombatStatus<TData = CombatStatus>(
  id: string,
  select?: (data: CombatStatus) => TData
) {
  return useSuspenseQuery({ ...combatStatusOptions(id), select })
}

export function useCombatId(charId: string) {
  return useCombatStatus(charId, cs => cs.combatId)
}

export function useCombatStatuses(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => combatStatusOptions(id)),
    combine: results => Object.fromEntries(ids.map((id, i) => [id, results[i].data]))
  })
}

export function getCombatStatus(store: QueryClient, charId: string) {
  const cs = store.getQueryData(combatStatusOptions(charId).queryKey)
  if (!cs) throw new Error(`Could not find combat status of char : ${charId}`)
  return cs
}

export function getCombatStatusesArr(store: QueryClient, playableIds: string[]) {
  return playableIds.map(id => {
    const data = store.getQueryData(combatStatusOptions(id).queryKey)
    if (!data) throw new Error(`Could not find combat status of char : ${id}`)
    return data
  })
}
export function getCombatStatuses(store: QueryClient, playableIds: string[]) {
  return Object.fromEntries(
    playableIds.map(id => {
      const data = store.getQueryData(combatStatusOptions(id).queryKey)
      if (!data) throw new Error(`Could not find combat status of char : ${id}`)
      return [id, data]
    })
  )
}
