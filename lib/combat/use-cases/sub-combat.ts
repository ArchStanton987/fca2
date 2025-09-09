/* eslint-disable import/prefer-default-export */
import { useCallback } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

import CombatState from "../CombatState"
import { DbCombatHistory, DbCombatInfo, DbCombatState } from "../combats.types"

const combatStateOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "state"],
    enabled: combatId !== "",
    queryFn: () => new Promise<CombatState>(() => {})
  })
const combatHistoryOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "history"],
    enabled: combatId !== "",
    queryFn: () => new Promise<DbCombatHistory>(() => {})
  })
const combatInfoOptions = (combatId: string) =>
  queryOptions({
    queryKey: ["v3", "combats", combatId, "info"],
    enabled: combatId !== "",
    queryFn: () => new Promise<DbCombatInfo>(() => {})
  })

export function useSubCombatState(combatId: string) {
  const options = combatStateOptions(combatId)
  const cb = useCallback((payload: DbCombatState) => new CombatState(payload), [])
  useSub<DbCombatState, CombatState>({ queryKey: options.queryKey, cb })
  return useQuery(options)
}

export function useSubCombatHistory(combatId: string) {
  const options = combatHistoryOptions(combatId)
  useSub<DbCombatHistory>({ queryKey: options.queryKey })
  return useQuery(options)
}

export function useSubCombatInfo(combatId: string) {
  const options = combatInfoOptions(combatId)
  useSub<DbCombatInfo>({ queryKey: options.queryKey })
  return useQuery(options)
}
