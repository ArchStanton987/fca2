import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

import { usePlayablesBaseSpecial } from "../abilities/base-special-provider"
import { usePlayablesExp } from "../progress/exp-provider"
import Health, { DbHealth } from "./Health"

export const getHealthOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "health"],
    enabled: charId !== "",
    queryFn: () => new Promise<Health>(() => {})
  })

export function useSubPlayablesHealth(ids: string[]) {
  const special = usePlayablesBaseSpecial(ids)
  const exp = usePlayablesExp(ids)
  useMultiSub(
    ids.map(id => ({
      path: getHealthOptions(id).queryKey.join("/"),
      cb: (payload: DbHealth) => new Health(payload, special[id], exp[id])
    }))
  )
}

export function usePlayablesHealth(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getHealthOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}

export function usePlayablesHealthEffects(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getHealthOptions(id)),
    combine: queries =>
      Object.fromEntries(
        ids.map((id, i) => [
          id,
          Object.values(queries[i].data.calculatedEffects)
            .map(e => e.data.symptoms)
            .flat()
        ])
      )
  })
}

export function useHealth<TData = Health>(id: string, select?: (data: Health) => TData) {
  return useSuspenseQuery({ ...getHealthOptions(id), select })
}

export function getHealth(store: QueryClient, charId: string) {
  const health = store.getQueryData(getHealthOptions(charId).queryKey)
  if (!health) throw new Error(`Could not find health for character : ${charId}`)
  return health
}
