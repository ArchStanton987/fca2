import { QueryClient, queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import Squad from "lib/character/Squad"
import { qkToPath, useSub, useSubCollection } from "lib/shared/db/useSub"

import { DbSquad } from "../squad-types"

export const getSquadsOptions = () =>
  queryOptions({
    queryKey: ["v3", "squads"],
    queryFn: () => new Promise<Record<string, Squad>>(() => {})
  })

const cb = (payload: DbSquad) => new Squad(payload)

export function useSubSquads() {
  const options = getSquadsOptions()
  const path = options.queryKey.join("/")
  useSubCollection(path, cb)
  return useQuery(options)
}

export function useSquads<TData = Record<string, Squad>>(
  select?: (data: Record<string, Squad>) => TData
) {
  return useSuspenseQuery({ ...getSquadsOptions(), select })
}

export const getSquadOptions = (squadId: string) =>
  queryOptions({
    queryKey: ["v3", "squads", squadId],
    queryFn: () => new Promise<Squad>(() => {}),
    enabled: typeof squadId === "string" && squadId !== ""
  })

export function useSubSquad(squadId: string) {
  const options = getSquadOptions(squadId)
  useSub(qkToPath(options.queryKey), cb)
  return useQuery(options)
}

export function useSquad<TData = Squad>(squadId: string, select?: (data: Squad) => TData) {
  return useSuspenseQuery({ ...getSquadOptions(squadId), select })
}
export function useDatetime(squadId: string) {
  return useSquad(squadId, squad => squad.datetime)
}
export function useSquadMembers(squadId: string) {
  return useSquad(squadId, squad => squad.members)
}
export function useSquadNpcs(squadId: string) {
  return useSquad(squadId, squad => squad.npcs)
}
export function useSquadLabel(squadId: string) {
  return useSquad(squadId, squad => squad.label)
}
export function useSquadCombats(squadId: string) {
  return useSquad(squadId, squad => squad.combats)
}
export function getSquad(store: QueryClient, squadId: string) {
  const squad = store.getQueryData(getSquadOptions(squadId).queryKey)
  if (!squad) throw new Error(`Squad with id : ${squadId} could not be found.`)
  return squad
}
export function getDatetime(store: QueryClient, squadId: string) {
  const squad = store.getQueryData(getSquadOptions(squadId).queryKey)
  if (!squad) throw new Error(`Squad with id : ${squadId} could not be found.`)
  return squad.datetime
}
export function getSquadPlayables(store: QueryClient, squadId: string) {
  const squad = store.getQueryData(getSquadOptions(squadId).queryKey)
  if (!squad) throw new Error(`Squad with id : ${squadId} could not be found.`)
  return { ...squad.members, ...squad.npcs }
}
