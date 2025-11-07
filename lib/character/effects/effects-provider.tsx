import { useCallback } from "react"

import { QueryClient, queryOptions, useQueries, useSuspenseQuery } from "@tanstack/react-query"
import { qkToPath, useSubMultiCollections } from "lib/shared/db/useSub"

import { useCollectiblesData } from "providers/AdditionalElementsProvider"

import Effect from "./Effect"
import { DbEffect, EffectId } from "./effects.types"

type Effects = Record<EffectId, Effect>

export const getEffectsOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "effects"],
    enabled: charId !== "",
    queryFn: () => new Promise<Effects>(() => {})
  })

export function useSubPlayablesEffects(ids: string[], datetime: Date) {
  const { effects } = useCollectiblesData()
  const cb = useCallback(
    (payload: DbEffect) => new Effect(payload, effects, datetime),
    [effects, datetime]
  )
  useSubMultiCollections(ids.map(id => ({ path: qkToPath(getEffectsOptions(id).queryKey), cb })))
  return useQueries({ queries: ids.map(id => getEffectsOptions(id)) })
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
