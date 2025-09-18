import { ReactNode, createContext, useContext, useMemo } from "react"

import Character from "lib/character/Character"
import NonHuman from "lib/npc/NonHuman"

import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSubs from "hooks/db/useRtdbSubs"
import LoadingScreen from "screens/LoadingScreen"

import { useCombat } from "./CombatProvider"
import { useGetUseCases } from "./UseCasesProvider"

type ContendersContextType = Record<string, Character | NonHuman>

const defaultContendersContext: ContendersContextType = {}

const ContendersContext = createContext<ContendersContextType>(defaultContendersContext)

export default function ContendersProvider({ children }: { children: ReactNode }) {
  const useCases = useGetUseCases()
  const squad = useSquad()
  const createdElements = useCreatedElements()

  const combat = useCombat()
  const contendersIds = useMemo(() => combat?.contendersIds ?? [], [combat])
  const contendersSub = useMemo(
    () =>
      useCases.character
        .subCharacters(contendersIds)
        .map((s, i) => ({ ...s, id: contendersIds[i] })),
    [useCases, contendersIds]
  )

  const contendersData = useRtdbSubs(contendersSub)

  const contenders = useMemo(() => {
    const result: Record<string, Character | NonHuman> = {}
    if (!contendersData) return result
    Object.entries(contendersData).forEach(([key, value]) => {
      if ("abilities" in value) {
        const char = new Character(key, value, squad, createdElements)
        result[key] = char
        return
      }
      const char = new NonHuman(key, value, squad)
      result[key] = char
    })
    return result
  }, [contendersData, squad, createdElements])

  const hasLength = contendersIds.length === Object.keys(contenders).length
  const hasCombat = contendersIds.length > 1

  if (hasCombat && !hasLength) return <LoadingScreen />
  return <ContendersContext.Provider value={contenders}>{children}</ContendersContext.Provider>
}

export function useContenders(): ContendersContextType
export function useContenders(id: string): Character | NonHuman
export function useContenders(id?: string) {
  const contenders = useContext(ContendersContext)
  if (contenders === undefined) throw new Error("Could not find ContendersContext")
  if (!id) return contenders
  if (!contenders[id]) throw new Error(`Could not find contender : ${id}`)
  return contenders[id]
}
