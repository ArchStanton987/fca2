import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

export const getCharCombatHistoryOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combats"],
    enabled: charId !== "",
    queryFn: () => new Promise<Record<string, string>>(() => {})
  })

export function useSubPlayablesCombatHistory(ids: string[]) {
  const queries = ids.map(id => getCharCombatHistoryOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))
}

export function usePlayablesCombatHistory(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getCharCombatHistoryOptions(id)),
    combine: results => Object.fromEntries(ids.map((id, i) => [id, results[i].data]))
  })
}
export function usePlayableCombatHistory(charId: string) {
  return useSuspenseQuery(getCharCombatHistoryOptions(charId))
}

export function getPlayableCombatHistory(store: QueryClient, charId: string) {
  const combatHistory = store.getQueryData(getCharCombatHistoryOptions(charId).queryKey)
  if (combatHistory === undefined) return {}
  return combatHistory
}
