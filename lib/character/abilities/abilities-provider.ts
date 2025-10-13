import { queryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import { usePlayablesItemSymptoms } from "lib/inventory/use-cases/get-item-symptoms"
import { useMultiSub } from "lib/shared/db/useSub"

import { usePlayablesHealthEffects } from "../health/health-provider"
import Abilities from "./Abilities"
import { DbAbilities } from "./abilities.types"

export const getDbAbilitiesOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities"],
    enabled: charId !== "",
    queryFn: () => new Promise<Abilities>(() => {})
  })

export function useSubPlayablesAbilities(ids: string[]) {
  const healthEffects = usePlayablesHealthEffects(ids)
  const itemsSymptoms = usePlayablesItemSymptoms(ids)
  useMultiSub(
    ids.map(id => ({
      path: getDbAbilitiesOptions(id).queryKey.join("/"),
      cb: (payload: DbAbilities) => new Abilities(payload, healthEffects[id], itemsSymptoms[id])
    }))
  )
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
