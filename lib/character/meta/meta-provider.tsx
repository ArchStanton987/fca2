/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useContext } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"

import LoadingScreen from "screens/LoadingScreen"

import { DbCharMeta } from "./meta"

export const getCharInfoOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "meta"],
    enabled: charId !== "",
    queryFn: () => new Promise<DbCharMeta>(() => {})
  })

const CharInfoContext = createContext({} as DbCharMeta)

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
