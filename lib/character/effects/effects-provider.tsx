import { QueryClient, queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"

import Effect from "./Effect"
import { EffectId } from "./effects.types"

type Effects = Record<EffectId, Effect>

export const getEffectsOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "effects"],
    enabled: charId !== "",
    queryFn: () => new Promise<Effects>(() => {})
  })

export function useEffectsSymptoms(id: string) {
  return useQuery({
    ...getEffectsOptions(id),
    select: result =>
      Object.values(result)
        .map(effect => effect.data.symptoms ?? [])
        .flat()
  })
}

export function useCharEffects<TData = Effects>(charId: string, select?: (data: Effects) => TData) {
  return useSuspenseQuery({ ...getEffectsOptions(charId), select })
}

export function useCharEffect(charId: string, effectId: EffectId) {
  return useCharEffects(charId, effects => effects[effectId])
}

export function getEffects(store: QueryClient, charId: string) {
  return store.getQueryData(getEffectsOptions(charId).queryKey) ?? ({} as Effects)
}
