import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import Squad from "lib/character/Squad"
import { useSubCollection } from "lib/shared/db/useSub"

import { DbSquad } from "../squad-types"

export const getSquadsOptions = () =>
  queryOptions({
    queryKey: ["v3", "squads"],
    queryFn: () => new Promise<Record<string, Squad>>(() => {})
  })

const cb = (payload: DbSquad) => new Squad(payload)

export function useSubSquads() {
  const options = getSquadsOptions()
  const path = options.queryKey.join("/")
  useSubCollection(path, cb)
  return useSuspenseQuery(options)
}

export function useSquad<TData = Squad>(id: string, select?: (data: Squad) => TData) {
  return useSuspenseQuery({
    ...getSquadsOptions(),
    select: squads => (select ? select(squads[id]) : squads[id])
  })
}
