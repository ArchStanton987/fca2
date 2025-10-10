import { queryOptions, useQueries } from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

import CharInfo, { DbCharInfo } from "./CharInfo"

export const getCharInfoOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "info"],
    enabled: charId !== "",
    queryFn: () => new Promise<CharInfo>(() => {})
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
  const queries = ids.map(id => getCharInfoOptions(id))
  return useQueries({
    queries,
    combine: req => ({
      isPending: req.some(q => q.isPending),
      isError: req.some(q => q.isError),
      data: req.map(q => q.data)
    })
  })
}
