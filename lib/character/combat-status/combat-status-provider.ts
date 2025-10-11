import { queryOptions } from "@tanstack/react-query"
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
