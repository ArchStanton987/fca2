import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export const getCharCombatHistoryOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combats"],
    enabled: charId !== "",
    queryFn: () => new Promise<Record<string, string>>(() => {})
  })

export function usePlayableCombatHistory(charId: string) {
  return useSuspenseQuery(getCharCombatHistoryOptions(charId))
}

export function getPlayableCombatHistory(store: QueryClient, charId: string) {
  const combatHistory = store.getQueryData(getCharCombatHistoryOptions(charId).queryKey)
  if (combatHistory === undefined) return {}
  return combatHistory
}
