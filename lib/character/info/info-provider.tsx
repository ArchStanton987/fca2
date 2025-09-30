/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useContext } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

import LoadingScreen from "screens/LoadingScreen"

import CharInfo, { DbCharInfo } from "./CharInfo"

export const getCharInfoOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "info"],
    enabled: charId !== "",
    queryFn: () => new Promise<CharInfo>(() => {})
  })

const CharInfoContext = createContext({} as CharInfo)

export function CharInfoProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const charInfo = useQuery(getCharInfoOptions(charId)).data
  if (!charInfo) return <LoadingScreen />
  return <CharInfoContext.Provider value={charInfo}>{children}</CharInfoContext.Provider>
}

export function useCharInfo() {
  const info = useContext(CharInfoContext)
  if (!info) throw new Error("CharInfoContext not found")
  return info
}

export function useSubPlayablesCharInfo(ids: string[]) {
  const queries = ids.map(id => getCharInfoOptions(id))
  useMultiSub<DbCharInfo>(
    queries.map((q, i) => ({
      path: q.queryKey.join("/"),
      cb: payload => new CharInfo(payload, ids[i])
    }))
  )
}

export function usePlayablesCharInfo(ids: string[]) {
  const queries = ids.map(id => getCharInfoOptions(id))
  return useQueries({
    queries,
    combine: req => ({
      isPending: req.some(q => q.isPending),
      isError: req.some(q => q.isError),
      data: req.map((q, i) => [ids[i], q.data])
    })
  })
}
