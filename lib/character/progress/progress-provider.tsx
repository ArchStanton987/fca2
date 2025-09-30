import { ReactNode, createContext, useContext, useMemo } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import {
  getAbilitiesOptions,
  usePlayablesAbilities
} from "lib/character/abilities/abilities-provider"
import { useCharInfo, usePlayablesCharInfo } from "lib/character/info/info-provider"
import { useMultiSub } from "lib/shared/db/useSub"

import LoadingScreen from "screens/LoadingScreen"

import Progress from "./Progress"

export const getExpOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "exp"],
    enabled: charId !== "",
    queryFn: () => new Promise<number>(() => {})
  })

const ExpContext = createContext({} as Progress)

export function ProgressProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const exp = useQuery(getExpOptions(charId)).data
  const dbAbilities = useQuery(getAbilitiesOptions(charId)).data
  const charInfo = useCharInfo()

  const progress = useMemo(() => {
    if (!dbAbilities || typeof exp !== "number") return undefined
    return new Progress(exp, dbAbilities, charInfo)
  }, [exp, dbAbilities, charInfo])

  if (!progress) return <LoadingScreen />

  return <ExpContext.Provider value={progress}>{children}</ExpContext.Provider>
}

export function useProgress() {
  const exp = useContext(ExpContext)
  if (!exp) throw new Error("ExpContext not found")
  return exp
}

export function useSubPlayablesProgress(ids: string[]) {
  const queries = ids.map(id => getExpOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))
}

export function usePlayablesProgress(ids: string[]) {
  const abilitiesReq = usePlayablesAbilities(ids)
  const charInfoReq = usePlayablesCharInfo(ids)

  const queries = ids.map(id => getExpOptions(id))
  return useQueries({
    queries,
    combine: q => ({
      isPending: q.some(query => query.isPending),
      isError: q.some(query => query.isError),
      data: q.map((query, i) => {
        if (typeof query.data !== "number" || !abilitiesReq.data[i] || charInfoReq.data[i])
          return undefined
        return new Progress(query.data, abilitiesReq.data[i], charInfoReq.data[i])
      })
    })
  })
}
