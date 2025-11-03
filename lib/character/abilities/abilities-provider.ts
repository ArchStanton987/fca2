import {
  QueryClient,
  queryOptions,
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { usePlayablesItemSymptoms } from "lib/inventory/use-cases/get-item-symptoms"
import { useMultiSub } from "lib/shared/db/useSub"

import { usePlayablesHealthEffects } from "../health/health-provider"
import { usePlayablesCharInfo } from "../info/info-provider"
import Abilities from "./Abilities"
import { DbAbilities } from "./abilities.types"

export const getDbAbilitiesOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities"],
    enabled: charId !== "",
    queryFn: () => new Promise<Abilities>(() => {})
  })

export function useSubPlayablesAbilities(ids: string[]) {
  const info = usePlayablesCharInfo(ids)
  const healthEffects = usePlayablesHealthEffects(ids)
  const itemsSymptoms = usePlayablesItemSymptoms(ids)
  useMultiSub(
    ids.map(id => ({
      path: getDbAbilitiesOptions(id).queryKey.join("/"),
      cb: (payload: DbAbilities) =>
        new Abilities({
          payload,
          healthSymptoms: healthEffects[id],
          itemsSymptoms: itemsSymptoms[id],
          templateId: info[id].templateId
        })
    }))
  )
  return useQueries({ queries: ids.map(id => getDbAbilitiesOptions(id)) })
}

export function usePlayablesAbilities(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => getDbAbilitiesOptions(id)),
    combine: queries => Object.fromEntries(ids.map((id, i) => [id, queries[i].data]))
  })
}

export function useAbilities<TData = Abilities>(id: string, select?: (data: Abilities) => TData) {
  return useSuspenseQuery({ ...getDbAbilitiesOptions(id), select })
}
export function useSpecial(charId: string) {
  return useAbilities(charId, abilities => abilities.special)
}
export function useSecAttr(charId: string) {
  return useAbilities(charId, abilities => abilities.secAttr)
}
export function useTraits(charId: string) {
  return useAbilities(charId, abilities => abilities.traits)
}
export function usePerks(charId: string) {
  return useAbilities(charId, abilities => abilities.perks)
}
export function useKnowledges(charId: string) {
  return useAbilities(charId, abilities => abilities.knowledges)
}
export function useCurrSecAttr(charId: string) {
  return useAbilities(charId, abilities => abilities.secAttr.curr)
}
export function useSkills(charId: string) {
  return useAbilities(charId, abilities => abilities.skills)
}
export function useCurrSkills(charId: string) {
  return useAbilities(charId, abilities => abilities.skills.curr)
}

export function getTraits(store: QueryClient, charId: string) {
  const ab = store.getQueryData(getDbAbilitiesOptions(charId).queryKey)
  return ab?.traits ?? {}
}
export function getSecAttr(store: QueryClient, charId: string) {
  const ab = store.getQueryData(getDbAbilitiesOptions(charId).queryKey)
  if (!ab?.secAttr) throw new Error(`Could not find sec attr for id : ${charId}`)
  return ab.secAttr
}
