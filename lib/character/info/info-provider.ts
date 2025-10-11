import { queryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

import CharInfo, { DbCharInfo } from "./CharInfo"

export const getCharInfoOptions = <TData = CharInfo>(
  charId: string,
  select?: (data: CharInfo) => TData
) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "info"],
    enabled: charId !== "",
    queryFn: () => new Promise<CharInfo>(() => {}),
    select
  })

export function useSubPlayablesCharInfo(ids: string[]) {
  const queries = ids.map(id => getCharInfoOptions(id))
  useMultiSub<DbCharInfo>(
    queries.map((q, i) => ({
      path: q.queryKey.join("/"),
      cb: payload => new CharInfo(payload, ids[i])
    }))
  )
}

export function usePlayablesCharInfo(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getCharInfoOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}

export function useCharInfo<TData = CharInfo>(id: string, select?: (data: CharInfo) => TData) {
  return useSuspenseQuery(getCharInfoOptions(id, select))
}
