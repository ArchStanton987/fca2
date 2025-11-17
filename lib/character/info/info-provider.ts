import { useMemo } from "react"

import {
  QueryClient,
  queryOptions,
  useQueries,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { qkToPath, useMultiSub } from "lib/shared/db/useSub"

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
  const cbs = useMemo(
    () => ids.map(id => (payload: DbCharInfo) => new CharInfo(payload, id)),
    [ids]
  )
  const subParams = useMemo(
    () =>
      ids.map((id, i) => ({
        path: qkToPath(getCharInfoOptions(id).queryKey),
        cb: cbs[i]
      })),
    [ids, cbs]
  )
  useMultiSub(subParams)
  return useQueries({ queries: ids.map(id => getCharInfoOptions(id)) })
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
export function useCharInfoQuery<TData = CharInfo>(id: string, select?: (data: CharInfo) => TData) {
  return useQuery(getCharInfoOptions(id, select))
}
export function useCharsNameInfo(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getCharInfoOptions(id)),
    combine: results => ids.map((id, i) => ({ id, fullname: results[i].data.fullname }))
  })
}

export function getCharInfo(store: QueryClient, charId: string) {
  const info = store.getQueryData(getCharInfoOptions(charId).queryKey)
  if (!info) throw new Error(`Could not find playable with id : ${charId}`)
  return info
}
