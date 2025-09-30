/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useCallback, useContext } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import LoadingScreen from "screens/LoadingScreen"

import { getAbilitiesOptions, usePlayablesAbilities } from "../abilities/abilities-provider"
import { usePlayablesProgress, useProgress } from "../progress/progress-provider"
import Health, { DbHealth } from "./Health"

export const getHealthOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "health"],
    enabled: charId !== "",
    queryFn: () => new Promise<Health>(() => {})
  })

export function useSubHealth(charId: string) {
  const abilitiesReq = useQuery(getAbilitiesOptions(charId))
  const baseSPECIAL = abilitiesReq.data?.baseSPECIAL
  const { exp } = useProgress()

  const cb = useCallback(
    (payload: DbHealth) => {
      if (!baseSPECIAL || typeof exp !== "number") return undefined
      return new Health(payload, baseSPECIAL, exp)
    },
    [baseSPECIAL, exp]
  )

  const options = getHealthOptions(charId)
  const path = options.queryKey.join("/")
  useSub(path, cb)
}

export function useHealthQuery(charId: string) {
  return useQuery(getHealthOptions(charId))
}

const HealthContext = createContext({} as Health)

export function HealthProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const healthReq = useHealthQuery(charId)
  if (!healthReq.data) return <LoadingScreen />
  return <HealthContext.Provider value={healthReq.data}>{children}</HealthContext.Provider>
}

export function useHealth() {
  const health = useContext(HealthContext)
  if (!health) throw new Error("HealthContext not found")
  return health
}

export function useSubPlayablesHealth(ids: string[]) {
  const queries = ids.map(id => getHealthOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))
}

export function usePlayablesHealth(ids: string[]) {
  const queries = ids.map(id => getHealthOptions(id))

  const abilitiesReq = usePlayablesAbilities(ids)
  const progressReq = usePlayablesProgress(ids)

  return useQueries({
    queries,
    combine: res => ({
      isPending: res.some(q => q.isPending),
      isError: res.some(q => q.isError),
      data: res.map((q, i) => {
        if (!q.data || !abilitiesReq.data[i] || !progressReq.data[i]) return undefined
        return new Health(q.data, abilitiesReq.data[i].special.base, progressReq.data[i].exp)
      })
    })
  })
}
