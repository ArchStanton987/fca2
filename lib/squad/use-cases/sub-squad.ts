import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import Squad from "lib/character/Squad"
import { useSubCollection } from "lib/shared/db/useSub"

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
  return useSuspenseQuery(options)
}

export function useSquads<TData = Record<string, Squad>>(
  select?: (data: Record<string, Squad>) => TData
) {
  return useSuspenseQuery({ ...getSquadsOptions(), select })
}

export function useSquad(squadId: string) {
  return useSquads(squads => squads[squadId])
}
export function useDatetime(squadId: string) {
  return useSquads(squads => squads[squadId].datetime)
}
export function useSquadMembers(squadId: string) {
  return useSquads(squads => squads[squadId].members)
}
export function useSquadNpcs(squadId: string) {
  return useSquads(squads => squads[squadId].npcs)
}
export function useSquadLabel(squadId: string) {
  return useSquads(squads => squads[squadId].label)
}
export function useSquadCombats(squadId: string) {
  return useSquads(squads => squads[squadId].combats)
}
export function getSquad(store: QueryClient, squadId: string) {
  const squads = store.getQueryData(getSquadsOptions().queryKey) ?? {}
  if (!squads[squadId]) throw new Error(`Squad with id : ${squadId} could not be found.`)
  return squads[squadId]
}
export function getDatetime(store: QueryClient, squadId: string) {
  const squads = store.getQueryData(getSquadsOptions().queryKey) ?? {}
  if (!squads[squadId]) throw new Error(`Squad with id : ${squadId} could not be found.`)
  return squads[squadId].datetime
}
