import { queryOptions } from "@tanstack/react-query"
import EffectsMappers from "lib/character/effects/effects.mappers"
import { DbEffectData, EffectData } from "lib/character/effects/effects.types"
import { useSubCollection } from "lib/shared/db/useSub"

export const getCreatedEffectsOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "effects"],
    queryFn: () => new Promise<Record<string, EffectData>>(() => {})
  })

const cb = (payload: DbEffectData) => EffectsMappers.toDomain(payload)

export const useSubCreatedEffects = () => {
  useSubCollection(getCreatedEffectsOptions().queryKey.join("/"), cb)
}
