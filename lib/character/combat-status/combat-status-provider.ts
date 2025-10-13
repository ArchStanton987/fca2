import { queryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import { useMultiSub } from "lib/shared/db/useSub"

import { CombatStatus, DbCombatStatus } from "./combat-status.types"

export const combatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    enabled: charId !== ""
  })

const cb = (res: DbCombatStatus) => new CombatStatus(res)

export function useSubPlayablesCombatStatus(ids: string[]) {
  const options = ids.map(id => combatStatusOptions(id))
  const subs = options.map(o => ({ path: o.queryKey.join("/"), cb }))
  useMultiSub(subs)
}

export function useCombatStatus<TData = CombatStatus>(
  id: string,
  select?: (data: CombatStatus) => TData
) {
  return useSuspenseQuery({ ...combatStatusOptions(id), select })
}

export function useCombatStatuses(ids: string[]) {
  return useSuspenseQueries({
    queries: ids.map(id => combatStatusOptions(id)),
    combine: results => Object.fromEntries(ids.map((id, i) => [id, results[i].data]))
  })
}
