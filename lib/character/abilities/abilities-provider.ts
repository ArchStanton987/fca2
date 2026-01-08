import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import Abilities from "./Abilities"
import { KnowledgeId, KnowledgeLevelValue } from "./knowledges/knowledge-types"

export const getDbAbilitiesOptions = (charId: string, enabled = true) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities"],
    enabled: charId !== "" && enabled,
    queryFn: () => new Promise<Abilities>(() => {})
  })

export const sortKnowledges = (knowledges: Partial<Record<KnowledgeId, KnowledgeLevelValue>>) =>
  Object.entries(knowledges)
    .map(([id, value]) => ({ id, value }))
    .sort((a, b) => b.value - a.value)

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
export function getSkills(store: QueryClient, charId: string) {
  const ab = store.getQueryData(getDbAbilitiesOptions(charId).queryKey)
  if (!ab?.skills) throw new Error(`Could not find skills for id : ${charId}`)
  return ab.skills
}
export function getKnowledges(store: QueryClient, charId: string) {
  const ab = store.getQueryData(getDbAbilitiesOptions(charId).queryKey)
  return ab?.knowledges ?? {}
}
