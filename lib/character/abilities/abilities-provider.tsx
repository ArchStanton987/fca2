/* eslint-disable import/prefer-default-export */
import { ReactNode, createContext, useContext, useMemo } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useItemSymptoms } from "lib/inventory/use-cases/get-item-symptoms"

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

export default function AbilitiesProvider({
  children,
  charId
}: {
  children: ReactNode
  charId: string
}) {
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

export function useAbilities() {
  const abilities = useContext(AbilitiesContext)
  if (!abilities) throw new Error("AbilitiesContext not found")
  return abilities
}
