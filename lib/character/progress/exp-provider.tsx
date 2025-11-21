import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export const getExpOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "exp"],
    enabled: charId !== "",
    queryFn: () => new Promise<number>(() => {})
  })

export function useExp(id: string) {
  return useSuspenseQuery(getExpOptions(id))
}

export function getExp(store: QueryClient, id: string) {
  const exp = store.getQueryData(getExpOptions(id).queryKey)
  if (exp === undefined) throw new Error(`Could not find exp for char : ${id}`)
  return exp
}
