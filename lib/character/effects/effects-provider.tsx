/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useCallback, useContext, useMemo } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useMultiSub, useSubCollection } from "lib/shared/db/useSub"

import { useSquad } from "contexts/SquadContext"
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
  const options = ids.map(id => getEffectsOptions(id))
  useSubMultiCollections(options.map(o => ({ path: o.queryKey.join("/") })))
}
