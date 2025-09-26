import { ReactNode, createContext, useContext, useMemo } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { getAbilitiesOptions } from "lib/character/abilities/abilities-provider"
import { useCharInfo } from "lib/character/info/info-provider"

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
