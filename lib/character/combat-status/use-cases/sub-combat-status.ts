import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import { CombatStatus, DbCombatStatus } from "../combat-status.types"

const combatStatusOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "combatStatus"],
    queryFn: () => new Promise<CombatStatus>(() => {}),
    enabled: charId !== ""
  })

const cb = (res: DbCombatStatus) => new CombatStatus(res)

export function useCharCombatStatus(charId: string) {
  const q = combatStatusOptions(charId)
  const path = q.queryKey.join("/")
  useSub<DbCombatStatus, CombatStatus>(path, cb)
  return useQuery(q)
}

export function useSubPlayablesCombatStatus(ids: string[]) {
  const options = ids.map(id => combatStatusOptions(id))
  const subs = options.map(o => ({ path: o.queryKey.join("/"), cb }))
  useMultiSub<DbCombatStatus, CombatStatus>(subs)
}

export const usePlayablesCombatStatus = (ids: string[]) => {
  const queries = ids.map(id => combatStatusOptions(id))
  return useQueries({
    queries,
    combine: res => ({
      isError: res.some(r => r.isError),
      isPending: res.some(r => r.isPending),
      data: res.map(cs => cs.data)
    })
  })
}
