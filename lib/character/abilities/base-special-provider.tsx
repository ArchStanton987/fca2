import { useMemo } from "react"

import { queryOptions, useQueries, useSuspenseQueries } from "@tanstack/react-query"
import { qkToPath, useMultiSub } from "lib/shared/db/useSub"

import { Special } from "./special/special.types"

export const getBaseSpecialOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities", "baseSPECIAL"],
    enabled: charId !== "",
    queryFn: () => new Promise<Special>(() => {})
  })

export function useSubPlayablesBaseSpecial(ids: string[]) {
  const params = useMemo(
    () => ids.map(id => ({ path: qkToPath(getBaseSpecialOptions(id).queryKey) })),
    [ids]
  )
  useMultiSub(params)
  return useQueries({ queries: ids.map(id => getBaseSpecialOptions(id)) })
}

export function usePlayablesBaseSpecial(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getBaseSpecialOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}
