/* eslint-disable import/prefer-default-export */
import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

const getExpOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "exp"],
    enabled: charId !== "",
    queryFn: () => new Promise<number>(() => {})
  })

export function useSubExp(charId: string) {
  const options = getExpOptions(charId)
  const path = options.queryKey.join("/")
  useSub(path)
}

export function useExpQuery(charId: string) {
  return useQuery(getExpOptions(charId))
}
