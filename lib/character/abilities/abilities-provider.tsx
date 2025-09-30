/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useContext, useMemo } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import {
  useContendersItemSymptoms,
  useItemSymptoms
} from "lib/inventory/use-cases/get-item-symptoms"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import { useCombat } from "providers/CombatProvider"
import LoadingScreen from "screens/LoadingScreen"

import Abilities from "./Abilities"
import { DbAbilities } from "./abilities.types"
import perksMap from "./perks/perks"
import { PerkId } from "./perks/perks.types"
import traitsMap from "./traits/traits"
import { TraitId } from "./traits/traits.types"

export const getAbilitiesOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities"],
    enabled: charId !== "",
    queryFn: () => new Promise<DbAbilities>(() => {})
  })

const AbilitiesContext = createContext({} as Abilities)

export function AbilitiesProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const abilitiesReq = useQuery(getAbilitiesOptions(charId))
  const symptomsReq = useItemSymptoms(charId)

  const abilities = useMemo(() => {
    if (!abilitiesReq.data) return undefined

    const traits = Object.keys(abilitiesReq.data?.traits ?? {})
    const perks = Object.keys(abilitiesReq.data?.perks ?? {})
    const traitsSymptoms = traits.map(t => traitsMap[t as TraitId].symptoms)
    const perksSymptoms = perks.map(t => perksMap[t as PerkId].symptoms)
    const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()

    return new Abilities(abilitiesReq.data, innateSymptoms, symptomsReq.data ?? [])
  }, [abilitiesReq.data, symptomsReq.data])

  if (!abilities) return <LoadingScreen />

  return <AbilitiesContext.Provider value={abilities}>{children}</AbilitiesContext.Provider>
}

const ContendersAbilitiesContext = createContext({} as Record<string, Abilities>)

export function ContendersAbilitiesProvider({
  children,
  charId
}: {
  children: ReactNode
  charId: string
}) {
  const combat = useCombat()
  const contendersIds = useMemo(
    () => combat?.contendersIds.filter(id => id === charId) ?? [],
    [combat, charId]
  )

  const queries = contendersIds.map(id => getAbilitiesOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))

  const contendersAbilities = useQueries({
    queries,
    combine: req => ({
      isPending: req.some(r => r.isPending),
      isError: req.some(r => r.isError),
      data: Object.fromEntries(req.map((r, i) => [contendersIds[i], r.data]))
    })
  }).data

  const contendersSymptoms = useContendersItemSymptoms(contendersIds).data

  const abilities = useMemo(() => {
    if (!contendersAbilities) return undefined
    const result: Record<string, Abilities> = {}
    Object.entries(contendersAbilities).forEach(([id, ab]) => {
      if (!ab) return
      const traits = Object.keys(ab?.traits ?? {})
      const perks = Object.keys(ab?.perks ?? {})
      const traitsSymptoms = traits.map(t => traitsMap[t as TraitId].symptoms)
      const perksSymptoms = perks.map(t => perksMap[t as PerkId].symptoms)
      const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()
      result[id] = new Abilities(ab, innateSymptoms, contendersSymptoms[id])
    })
    return result
  }, [contendersAbilities, contendersSymptoms])

  if (!abilities) return <LoadingScreen />

  return (
    <ContendersAbilitiesContext.Provider value={abilities}>
      {children}
    </ContendersAbilitiesContext.Provider>
  )
}

// export function useAbilities() {
//   const abilities = useContext(AbilitiesContext)
//   if (!abilities) throw new Error("AbilitiesContext not found")
//   return abilities
// }

export function useSubPlayablesAbilities(ids: string[]) {
  const queries = ids.map(id => getAbilitiesOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))
}

export function usePlayablesAbilities(ids: string[]) {
  const queries = ids.map(id => getAbilitiesOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))

  const itemsSymptomsReq = useContendersItemSymptoms(ids)

  return useQueries({
    queries,
    combine: req => ({
      isPending: req.some(r => r.isPending) || itemsSymptomsReq.isPending,
      isError: req.some(r => r.isError) || itemsSymptomsReq.isError,
      data: req.map((r, i) => {
        const traits = Object.keys(r.data?.traits ?? {})
        const perks = Object.keys(r.data?.perks ?? {})
        const traitsSymptoms = traits.map(t => traitsMap[t as TraitId].symptoms)
        const perksSymptoms = perks.map(t => perksMap[t as PerkId].symptoms)
        const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()
        if (!r.data) return undefined
        return new Abilities(r.data, innateSymptoms, itemsSymptomsReq.data[i])
      })
    })
  })
}

export function useAbilities(): Abilities
export function useAbilities(charId: string): Abilities | undefined
export function useAbilities(charId?: string) {
  const abilitiesOptions = getAbilitiesOptions(charId ?? "")
  useSub(abilitiesOptions.queryKey.join("/"))
  const dbAbilities = useQuery(abilitiesOptions)
  const symptoms = useItemSymptoms(charId ?? "").data ?? []
  const context = useContext(AbilitiesContext)
  if (!context) throw new Error("AbilitiesContext not found")
  if (!charId) return context

  if (dbAbilities.isPending || dbAbilities.isError) return undefined

  const traits = Object.keys(dbAbilities.data.traits ?? {})
  const perks = Object.keys(dbAbilities.data.perks ?? {})
  const traitsSymptoms = traits.map(t => traitsMap[t as TraitId].symptoms)
  const perksSymptoms = perks.map(t => perksMap[t as PerkId].symptoms)
  const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()
  return new Abilities(dbAbilities.data, innateSymptoms, symptoms)
}
