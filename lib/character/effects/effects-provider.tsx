import { useCallback } from "react"

import { queryOptions } from "@tanstack/react-query"
import { useSubMultiCollections } from "lib/shared/db/useSub"

import { useCollectiblesData } from "providers/AdditionalElementsProvider"

import Effect from "./Effect"
import { DbEffect } from "./effects.types"

export const getEffectsOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "effects"],
    enabled: charId !== "",
    queryFn: () => new Promise<Record<string, Effect>>(() => {})
  })

export function useSubPlayablesEffects(ids: string[], datetime: Date) {
  const { effects } = useCollectiblesData()
  const cb = useCallback(
    (payload: DbEffect) => new Effect(payload, effects, datetime),
    [effects, datetime]
  )
  useSubMultiCollections(ids.map(id => ({ path: getEffectsOptions(id).queryKey.join("/"), cb })))
}
