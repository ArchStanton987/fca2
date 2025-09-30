import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

export const getCombatHistoryOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combats"],
    queryFn: () => new Promise<Record<string, string>>(() => {}),
    enabled: charId !== ""
  })

export function usePlayableCombatHistory(charId: string) {
  const options = getCombatHistoryOptions(charId)
  useSub(options.queryKey.join("/"))
  return useQuery(options)
}
