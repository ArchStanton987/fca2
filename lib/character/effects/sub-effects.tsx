/* eslint-disable import/prefer-default-export */
import { useCallback } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSubCollection } from "lib/shared/db/useSub"

import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"

import Effect from "./Effect"
import effectsMap from "./effects"
import { DbEffect } from "./effects.types"

const getEffectsOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "effects"],
    enabled: charId !== "",
    queryFn: () => new Promise<Record<string, Effect>>(() => {})
  })

export function useSubEffects(charId: string) {
  const { newEffects } = useCreatedElements()
  const { date } = useSquad()
  const options = getEffectsOptions(charId)
  const path = options.queryKey.join("/")
  const cb = useCallback(
    (payload: DbEffect) => new Effect(payload, { ...effectsMap, ...newEffects }, date),
    [newEffects, date]
  )
  useSubCollection(path, cb)
}

export function useEffectsQuery(charId: string) {
  return useQuery(getEffectsOptions(charId))
}
