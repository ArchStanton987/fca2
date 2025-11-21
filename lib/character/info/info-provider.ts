import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"

import CharInfo from "./CharInfo"

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

export function usePlayablesCharInfo(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getCharInfoOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}

export function useCharInfo<TData = CharInfo>(id: string, select?: (data: CharInfo) => TData) {
  return useSuspenseQuery(getCharInfoOptions(id, select))
}
export function useFullname(id: string) {
  return useCharInfo(id, i => i.fullname)
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
