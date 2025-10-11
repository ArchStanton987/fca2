import { useQuery, useSuspenseQueries } from "@tanstack/react-query"
import { Symptom } from "lib/character/effects/symptoms.type"
import { useMultiSub, useSub } from "lib/shared/db/useSub"

import { Item, getItemsOptions } from "../use-sub-inv-cat"

const getItemSymptoms = (items: Record<string, Item>) =>
  Object.values(items).reduce((acc, item) => {
    if (item.category === "weapons" || item.category === "consumables") return acc
    return item.isEquipped ? [...acc, ...item.data.symptoms] : acc
  }, [] as Symptom[])

export function useItemSymptoms(charId: string) {
  const options = getItemsOptions(charId)
  useSub(options.queryKey.join("/"))
  return useQuery({ ...options, select: getItemSymptoms })
}

export function usePlayablesItemSymptoms(ids: string[]) {
  const queries = ids.map(id => getItemsOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))

  return useSuspenseQueries({
    queries,
    combine: req => Object.fromEntries(req.map((r, i) => [ids[i], getItemSymptoms(r.data ?? {})]))
  })
}
