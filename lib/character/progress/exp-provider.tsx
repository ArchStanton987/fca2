import { useMemo } from "react"

import {
  QueryClient,
  queryOptions,
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { qkToPath, useMultiSub } from "lib/shared/db/useSub"

export const getExpOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "exp"],
    enabled: charId !== "",
    queryFn: () => new Promise<number>(() => {})
  })

export function useSubPlayablesExp(ids: string[]) {
  const paths = useMemo(
    () => ids.map(id => ({ path: qkToPath(getExpOptions(id).queryKey) })),
    [ids]
  )
  useMultiSub(paths)
  return useQueries({ queries: ids.map(id => getExpOptions(id)) })
}

export function usePlayablesExp(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getExpOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}

export function useExp(id: string) {
  return useSuspenseQuery(getExpOptions(id))
}

export function getExp(store: QueryClient, id: string) {
  const exp = store.getQueryData(getExpOptions(id).queryKey)
  if (exp === undefined) throw new Error(`Could not find exp for char : ${id}`)
  return exp
}
