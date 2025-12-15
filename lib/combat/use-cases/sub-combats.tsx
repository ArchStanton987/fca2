import { useCallback } from "react"

import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { qkToPath, useSub } from "lib/shared/db/useSub"

import Combat from "../Combat"
import CombatState from "../CombatState"
import { DbCombatHistory, DbCombatInfo, DbCombatState } from "../combats.types"

export const combatStateOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "state"],
    enabled: combatId !== "",
    queryFn: () => new Promise<CombatState>(() => {})
  })
export const combatHistoryOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "history"],
    enabled: combatId !== "",
    queryFn: () => new Promise<DbCombatHistory>(() => {})
  })
export const getCombatOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "info"],
    enabled: combatId !== "",
    queryFn: () => new Promise<Combat>(() => {})
  })

const cb = (payload: DbCombatState) => new CombatState(payload)

function SubPrim({ id }: { id: string }) {
  useSub(qkToPath(combatStateOptions(id).queryKey), cb)
  useSub(qkToPath(combatHistoryOptions(id).queryKey))
  return null
}
function SubInfo({ id }: { id: string }) {
  const { data: history = {} } = useQuery(combatHistoryOptions(id))
  const combatCb = useCallback(
    (data: DbCombatInfo) => new Combat({ info: data, history, combatId: id }),
    [history, id]
  )
  useSub(qkToPath(getCombatOptions(id).queryKey), combatCb)
  return null
}
function SubCombat({ id }: { id: string }) {
  return (
    <>
      <SubPrim id={id} />
      <SubInfo id={id} />
    </>
  )
}

export function SubCombats({ ids }: { ids: string[] }) {
  return ids.map(id => <SubCombat key={id} id={id} />)
}

export function useCombatState<TData = CombatState>(
  combatId: string,
  select?: (data: CombatState) => TData
) {
  return useSuspenseQuery({ ...combatStateOptions(combatId), select })
}

export function useCombats(combatsIds: string[]) {
  return useSuspenseQueries({
    queries: combatsIds.map(id => getCombatOptions(id)),
    combine: results => Object.fromEntries(combatsIds.map((id, i) => [id, results[i]]))
  })
}

export function useCombat<TData = Combat>(combatId: string, select?: (data: Combat) => TData) {
  return useSuspenseQuery({ ...getCombatOptions(combatId), select })
}

export function useContenders(combatId: string) {
  return useCombat(combatId, combat => combat.contendersIds)
}

export function getCombat(store: QueryClient, combatId: string) {
  const combat = store.getQueryData(getCombatOptions(combatId).queryKey)
  if (!combat) throw new Error(`Could not find combat with id : ${combatId}`)
  return combat
}
export function getContenders(store: QueryClient, combatId: string) {
  const combat = store.getQueryData(getCombatOptions(combatId).queryKey)
  if (!combat) throw new Error(`Could not find combat with id : ${combatId}`)
  return combat.contendersIds
}
export function getCombatState(store: QueryClient, combatId: string) {
  const combatState = store.getQueryData(combatStateOptions(combatId).queryKey)
  if (!combatState) throw new Error(`Could not find combat state with id : ${combatId}`)
  return combatState
}
