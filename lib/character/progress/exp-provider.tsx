import { queryOptions, useSuspenseQueries } from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

export const getExpOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "exp"],
    enabled: charId !== "",
    queryFn: () => new Promise<number>(() => {})
  })

export function useSubPlayablesExp(ids: string[]) {
  const queries = ids.map(id => getExpOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))
}

export function usePlayablesExp(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getExpOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}
