import { queryOptions, useQueries } from "@tanstack/react-query"
import { usePlayablesAbilities } from "lib/character/abilities/abilities-provider"
import { usePlayablesCharInfo } from "lib/character/info/info-provider"
import { useMultiSub } from "lib/shared/db/useSub"

import Progress from "./Progress"

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

export function useSubPlayablesProgress(ids: string[]) {
  const queries = ids.map(id => getExpOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))
}

export function usePlayablesProgress(ids: string[]) {
  const abilitiesReq = usePlayablesAbilities(ids)
  const charInfoReq = usePlayablesCharInfo(ids)

  const queries = ids.map(id => getExpOptions(id))
  return useQueries({
    queries,
    combine: q => ({
      isPending: q.some(query => query.isPending),
      isError: q.some(query => query.isError),
      data: q.map((query, i) => {
        if (typeof query.data !== "number" || !abilitiesReq.data[i] || charInfoReq.data[i])
          return undefined
        return new Progress(query.data, abilitiesReq.data[i], charInfoReq.data[i])
      })
    })
  })
}
