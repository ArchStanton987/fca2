import {
  QueryClient,
  queryOptions,
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { qkToPath, useMultiSub } from "lib/shared/db/useSub"

import { usePlayablesBaseSpecial } from "../abilities/base-special-provider"
import { usePlayablesCharInfo } from "../info/info-provider"
import { usePlayablesExp } from "../progress/exp-provider"
import Health, { DbHealth } from "./Health"
import { LimbId } from "./health.const"

export const getHealthOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "health"],
    enabled: charId !== "",
    queryFn: () => new Promise<Health>(() => {})
  })

export function useSubPlayablesHealth(ids: string[]) {
  const special = usePlayablesBaseSpecial(ids)
  const exp = usePlayablesExp(ids)
  const info = usePlayablesCharInfo(ids)

  useMultiSub(
    ids.map(id => ({
      path: qkToPath(getHealthOptions(id).queryKey),
      cb: (payload: DbHealth) =>
        new Health({
          health: payload,
          baseSPECIAL: special[id],
          exp: exp[id],
          templateId: info[id].templateId
        })
    }))
  )
  return useQueries({ queries: ids.map(id => getHealthOptions(id)) })
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
export function useRads(id: string) {
  return useHealth(id, health => health.rads)
}
export function useCurrHp(id: string) {
  return useHealth(id, health => health.currHp)
}
export function useLimbHp(charId: string, limbId: LimbId) {
  return useHealth(charId, health => health.limbs[limbId])
}

export function getHealth(store: QueryClient, charId: string) {
  const health = store.getQueryData(getHealthOptions(charId).queryKey)
  if (!health) throw new Error(`Could not find health for character : ${charId}`)
  return health
}
