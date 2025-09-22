import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

import { DbCharMeta } from "./meta"

const getCharInfoOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "meta"],
    enabled: charId !== "",
    queryFn: () => new Promise<DbCharMeta>(() => {})
  })

export function useSubCharInfo(charId: string) {
  const options = getCharInfoOptions(charId)
  const path = options.queryKey.join("/")
  useSub(path)
}

export function useCharInfoQuery(charId: string) {
  return useQuery(getCharInfoOptions(charId))
}
