import { QueryClient, queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"

import Health from "./Health"
import { LimbId } from "./health.const"

export const getHealthOptions = (charId: string, isReady = true) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "health"],
    enabled: charId !== "" && isReady,
    queryFn: () => new Promise<Health>(() => {})
  })

export function useHealthSymptoms(id: string) {
  return useQuery({
    ...getHealthOptions(id),
    select: result =>
      Object.values(result.calculatedEffects ?? {})
        .map(e => e.data.symptoms)
        .flat()
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
