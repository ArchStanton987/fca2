import { queryOptions } from "@tanstack/react-query"
import EffectsMappers from "lib/character/effects/effects.mappers"
import { DbEffectData, EffectData } from "lib/character/effects/effects.types"

export const getCreatedEffectsOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "effects"],
    queryFn: () => new Promise<Record<string, EffectData>>(() => {})
  })

export const createdEffCb = (payload: DbEffectData) => EffectsMappers.toDomain(payload)
