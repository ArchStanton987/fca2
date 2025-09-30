/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useCallback, useContext, useMemo } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useSubCollection, useSubMultiCollections } from "lib/shared/db/useSub"
import { useSquad } from "lib/squad/use-cases/sub-squad"

import useCreatedElements from "hooks/context/useCreatedElements"
import LoadingScreen from "screens/LoadingScreen"

import { useHealth } from "../health/health-provider"
import Effect from "./Effect"
import effectsMap from "./effects"
import { DbEffect } from "./effects.types"

export const getEffectsOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "effects"],
    enabled: charId !== "",
    queryFn: () => new Promise<Record<string, Effect>>(() => {})
  })

export function useSubEffects(charId: string) {
  const { newEffects } = useCreatedElements()
  const { datetime } = useSquad()
  const options = getEffectsOptions(charId)
  const path = options.queryKey.join("/")
  const cb = useCallback(
    (payload: DbEffect) => new Effect(payload, { ...effectsMap, ...newEffects }, datetime),
    [newEffects, datetime]
  )
  useSubCollection(path, cb)
}

export function useEffectsQuery(charId: string) {
  return useQuery(getEffectsOptions(charId))
}

const EffectsContext = createContext({} as Record<string, Effect>)

export function EffectsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const effectsReq = useEffectsQuery(charId)
  const { calculatedEffects } = useHealth()

  const effects = useMemo(
    () => ({ ...effectsReq.data, ...calculatedEffects }),
    [effectsReq.data, calculatedEffects]
  )

  if (!effects) return <LoadingScreen />

  return <EffectsContext.Provider value={effects}>{children}</EffectsContext.Provider>
}

export function usePCEffects() {
  const effects = useContext(EffectsContext)
  if (!effects) throw new Error("EffectsContext not found")
  return effects
}

export function useSubPlayablesEffects(ids: string[]) {
  const { datetime } = useSquad()
  const { newEffects } = useCreatedElements()
  const allEffects = useMemo(() => ({ ...newEffects, ...effectsMap }), [newEffects])

  const cb = useCallback(
    (payload: DbEffect) => new Effect(payload, allEffects, datetime),
    [allEffects, datetime]
  )

  useSubMultiCollections(ids.map(id => ({ path: getEffectsOptions(id).queryKey.join("/"), cb })))
}

export function usePlayablesEffects(ids: string[]) {
  const queries = ids.map(id => getEffectsOptions(id))
  return useQueries({
    queries,
    combine: res => ({
      isPending: res.some(q => q.isPending),
      isError: res.some(q => q.isError),
      data: res.map(q => q.data)
    })
  })
}
